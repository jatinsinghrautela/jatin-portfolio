declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    CMS_OWNER_EMAIL?: string;
    CMS_PASSWORD_HASH?: string;
    RESEND_API_KEY?: string;
    CONTACT_TO?: string;
    CONTACT_FROM?: string;
    BUCKET?: R2Bucket;
  }
}
