import fs from 'fs';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { IBlogService, BlogService } from '@utils/BlogService';
import { IBlog } from '@types';

const ranking_file =
  process.env.GOOGLE_APPLICATION_RANKING_DATA_FILE || 'utils/ranking_data.json';

export async function getRanking(): Promise<IBlog[] | string | null> {
  // ランキングデータを保存したファイルが存在する場合は、ファイルからデータを取得
  // （ランキングデータは全ページ同じで、ビルド時間短縮のため。）
  if (fs.existsSync(ranking_file)) {
    try {
      return JSON.parse(fs.readFileSync(ranking_file, 'utf-8'));
    } catch (e) {
      // ファイルの読み込みで失敗した場合は、console.log出力してランキングデータの取得に進む。
      console.log(`read error: ${ranking_file}\nerror details: ${e}`);
    }
  }
  const path = process.env.GOOGLE_APPLICATION_KEY_FILE;
  if (path === undefined || !fs.existsSync(path))
    return 'Not found json key file.';
  process.env.GOOGLE_APPLICATION_CREDENTIALS =
    process.env.GOOGLE_APPLICATION_KEY_FILE;
  const analyticsDataClient = new BetaAnalyticsDataClient();

  const propertyId = process.env.GOOGLE_APPLICATION_PROPERTYID || '';
  const startdays =
    process.env.GOOGLE_APPLICATION_DATE_RANGE_START_DATE || '730';
  const limit =
    process.env.GOOGLE_APPLICATION_RANKING_REPORT_REQUEST_LIMIT || 10;
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: `${startdays}daysAgo`,
          endDate: 'today',
        },
      ],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'activeUsers' }],
      dimensionFilter: {
        filter: {
          // /blogs/* 以外を除外
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
          const path = row.dimensionValues?.[0].value?.split('/');
          const id = path ? path[path.length - 1] : '';
          if (id !== '') {
            const data: IBlog = await service.getBlogById(id);
            return data ? { ...data, rank: index + 1 } : undefined;
          }
        })
      )
    ).filter(
      (data): data is Exclude<typeof data, undefined> => data !== undefined
    );
    // 取得したランキングデータをファイルに保存
    fs.writeFileSync(ranking_file, JSON.stringify(rankings));
    return rankings;
  } catch (e) {
    return `Failed to get ranking data.\nerror details: ${e}`;
  }
}
