import fs from 'fs';
import path from 'path';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { IBlogService, BlogService } from '@utils/BlogService';
import { IBlog } from '@types';

// Cache file path for ranking results.
// If not specified in .env, use utils/ranking_data.json as before.
const rankingFile =
  process.env.GOOGLE_APPLICATION_RANKING_DATA_FILE || 'utils/ranking_data.json';

/**
 * Resolves the service account JSON key file for GA4.
 *
 * Search order:
 * 1. GOOGLE_APPLICATION_KEY_FILE from .env
 * 2. A file generated into .secrets by generate-secret-json.js using only the basename
 * 3. The default .secrets/google-analytics-key.json
 *
 * Returns the path if found, otherwise null.
 */
function resolveGoogleApplicationKeyFile(): string | null {
  const configured = process.env.GOOGLE_APPLICATION_KEY_FILE;

  const candidates = [
    configured,
    configured ? path.join('.secrets', path.basename(configured)) : undefined,
    path.join('.secrets', 'google-analytics-key.json'),
  ].filter((candidate): candidate is string => Boolean(candidate));

  const found = candidates.find((candidate) => fs.existsSync(candidate));
  return found ?? null;
}

type AnalyticsClientResult =
  | {
      client: BetaAnalyticsDataClient;
      credentialSource: string;
    }
  | {
      client: null;
      credentialSource: null;
      warning: string;
    };

/**
 * Creates a GA4 API client.
 *
 * Priority order:
 * 1. Use a JSON key file if it exists on disk
 * 2. Use client_email / private_key from .env directly
 * 3. If neither is available, skip only the ranking feature
 *
 * This allows the app to work even if generate-secret-json.js
 * has not been run, as long as the service account credentials
 * are available in .env.local.
 */
function createAnalyticsDataClient(): AnalyticsClientResult {
  const credentialPath = resolveGoogleApplicationKeyFile();
  if (credentialPath) {
    return {
      client: new BetaAnalyticsDataClient({
        keyFilename: credentialPath,
      }),
      credentialSource: credentialPath,
    };
  }

  const clientEmail = process.env.GOOGLE_APPLICATION_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_APPLICATION_PRIVATE_KEY;
  const projectId = process.env.GOOGLE_APPLICATION_PROJECT_ID;

  if (clientEmail && privateKey) {
    return {
      client: new BetaAnalyticsDataClient({
        credentials: {
          client_email: clientEmail,
          // Convert "\n" in the .env private key back to real newlines.
          private_key: privateKey.replace(/\\n/g, '\n'),
        },
        projectId,
      }),
      credentialSource: 'inline-env',
    };
  }

  return {
    client: null,
    credentialSource: null,
    warning:
      'Skip ranking generation: Google Analytics credentials are not configured.',
  };
}

export async function getRanking(): Promise<IBlog[] | string | null> {
  // If a cached ranking file already exists, use it first.
  // Since this data is shared across all pages, reusing it helps reduce build time.
  if (fs.existsSync(rankingFile)) {
    try {
      return JSON.parse(fs.readFileSync(rankingFile, 'utf-8'));
    } catch (e) {
      // Only regenerate the cache if reading it fails.
      console.log(`read error: ${rankingFile}\nerror details: ${e}`);
    }
  }

  const propertyId = process.env.GOOGLE_APPLICATION_PROPERTYID;
  if (!propertyId) {
    // Without propertyId, the GA4 report cannot run at all.
    // Do not break the whole site; disable ranking only.
    console.warn(
      '[Ranking] Skip ranking generation: GOOGLE_APPLICATION_PROPERTYID is not set.',
    );
    return null;
  }

  const analyticsClientResult = createAnalyticsDataClient();
  if (!analyticsClientResult.client) {
    // This absorbs the old "Not found json key file." case here.
    // Even if the key file is missing, inline env credentials can still work.
    // If neither is available, skip ranking only.
    console.warn(`[Ranking] ${analyticsClientResult.warning}`);
    return null;
  }

  const analyticsDataClient = analyticsClientResult.client;

  const startDays =
    process.env.GOOGLE_APPLICATION_RANKING_DATE_RANGE_START_DATE || '730';

  const limit = Number(
    process.env.GOOGLE_APPLICATION_RANKING_REPORT_REQUEST_LIMIT || 10,
  );

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: `${startDays}daysAgo`,
          endDate: 'today',
        },
      ],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'activeUsers' }],
      dimensionFilter: {
        filter: {
          // Exclude anything outside /blogs/*.
          stringFilter: {
            value: 'blogs',
            matchType: 'CONTAINS',
          },
          fieldName: 'pagePath',
        },
      },
      limit,
    });

    if (!response.rows) return null;

    const service: IBlogService = new BlogService();

    const rankings: IBlog[] = await (
      await Promise.all(
        response.rows.map(async (row, index) => {
          const pagePath = row.dimensionValues?.[0].value?.split('/');
          const id = pagePath ? pagePath[pagePath.length - 1] : '';

          if (id !== '') {
            const data: IBlog = await service.getBlogById(id);
            return data ? { ...data, rank: index + 1 } : undefined;
          }
        }),
      )
    ).filter(
      (data): data is Exclude<typeof data, undefined> => data !== undefined,
    );

    // Create the output directory if it does not exist.
    fs.mkdirSync(path.dirname(rankingFile), { recursive: true });

    // Save the fetched ranking data as a cache.
    fs.writeFileSync(rankingFile, JSON.stringify(rankings));

    return rankings;
  } catch (e) {
    return `Failed to get ranking data.\nerror details: ${e}`;
  }
}
