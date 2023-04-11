const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const keyFile = process.env.GOOGLE_APPLICATION_KEY_FILE;
if (!keyFile) {
  throw new Error(
    'GOOGLE_APPLICATION_KEY_FILE environment variable is not defined.'
  );
}
const project_id = process.env.GOOGLE_APPLICATION_PROJECT_ID;
if (!project_id) {
  throw new Error(
    'GOOGLE_APPLICATION_PROJECT_ID environment variable is not defined.'
  );
}
const private_key_id = process.env.GOOGLE_APPLICATION_PRIVATE_KEY_ID;
if (!private_key_id) {
  throw new Error(
    'GOOGLE_APPLICATION_PRIVATE_KEY_ID environment variable is not defined.'
  );
}
const private_key = process.env.GOOGLE_APPLICATION_PRIVATE_KEY;
if (!private_key) {
  throw new Error(
    'GOOGLE_APPLICATION_PRIVATE_KEY environment variable is not defined.'
  );
}
const client_email = process.env.GOOGLE_APPLICATION_CLIENT_EMAIL;
if (!client_email) {
  throw new Error(
    'GOOGLE_APPLICATION_CLIENT_EMAIL environment variable is not defined.'
  );
}
const client_id = process.env.GOOGLE_APPLICATION_CLIENT_ID;
if (!client_id) {
  throw new Error(
    'GOOGLE_APPLICATION_CLIENT_ID environment variable is not defined.'
  );
}
const client_x509_cert_url =
  process.env.GOOGLE_APPLICATION_CLIENT_X509_CERT_URL;
if (!client_x509_cert_url) {
  throw new Error(
    'GOOGLE_APPLICATION_CLIENT_X509_CERT_URL environment variable is not defined.'
  );
}
const secretData = {
  type: 'service_account',
  project_id: project_id,
  private_key_id: private_key_id,
  private_key: private_key,
  client_email: client_email,
  client_id: client_id,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: client_x509_cert_url,
};

fs.writeFileSync(`./${keyFile}`, JSON.stringify(secretData));
