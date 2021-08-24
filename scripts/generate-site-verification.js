// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
function generateSiteVerification() {
    if (process.env.GOOGLE_SITE_VERIFICATION_HTML_CODE) {
        const siteVerificationTxt = `google-site-verification: ${process.env.GOOGLE_SITE_VERIFICATION_HTML_CODE}`;
        fs.writeFileSync(`public/${process.env.GOOGLE_SITE_VERIFICATION_HTML_FILE_NAME}`, siteVerificationTxt);
        console.log(`Generated: /${process.env.GOOGLE_SITE_VERIFICATION_HTML_FILE_NAME}`);
    }
}

module.exports = generateSiteVerification;
