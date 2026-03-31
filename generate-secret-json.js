const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// This runs as a standalone Node script before the Next.js build,
// so explicitly load .env.local.
// Values already injected into process.env by Netlify or similar platforms
// will still be used as-is.
dotenv.config({ path: '.env.local' });

// List of env vars required to generate the service account JSON.
// GOOGLE_APPLICATION_KEY_FILE is optional,
// and .secrets/google-analytics-key.json is used by default if it is not set.
const requiredEnvNames = [
  'GOOGLE_APPLICATION_PROJECT_ID',
  'GOOGLE_APPLICATION_PRIVATE_KEY_ID',
  'GOOGLE_APPLICATION_PRIVATE_KEY',
  'GOOGLE_APPLICATION_CLIENT_EMAIL',
  'GOOGLE_APPLICATION_CLIENT_ID',
  'GOOGLE_APPLICATION_CLIENT_X509_CERT_URL',
];

// Output path. Use the default value if not specified.
const configuredKeyFile =
  process.env.GOOGLE_APPLICATION_KEY_FILE ||
  '.secrets/google-analytics-key.json';

// Do nothing if the key file already exists.
// This avoids breaking setups that are intended to use an existing file.
if (fs.existsSync(configuredKeyFile)) {
  console.log(
    `[generate-secret-json] Skip generation. Key file already exists: ${configuredKeyFile}`,
  );
  process.exit(0);
}

const missingEnvNames = requiredEnvNames.filter((name) => !process.env[name]);

// For public repos / local builds:
// If secret env vars are missing, do not stop the build;
// just skip the file generation.
if (missingEnvNames.length > 0) {
  console.warn(
    `[generate-secret-json] Skip secret json generation. Missing env: ${missingEnvNames.join(
      ', ',
    )}`,
  );
  process.exit(0);
}

// If the path is relative, resolve it from the project root.
// Example: .secrets/google-analytics-key.json
const outputPath = path.resolve(process.cwd(), configuredKeyFile);

// Create the output directory first.
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// Build the Google service account JSON.
// private_key may be stored in .env using "\n",
// so convert it back to real line breaks.
const secretData = {
  type: 'service_account',
  project_id: process.env.GOOGLE_APPLICATION_PROJECT_ID,
  private_key_id: process.env.GOOGLE_APPLICATION_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_APPLICATION_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_APPLICATION_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_APPLICATION_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.GOOGLE_APPLICATION_CLIENT_X509_CERT_URL,
};

// Write the JSON key file used during the build.
fs.writeFileSync(outputPath, JSON.stringify(secretData));

console.log(`[generate-secret-json] Wrote ${outputPath}`);
