declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    ASSETS?: Fetcher;
    MEDIA_STORE?: string;
    REQUIRE_TURNSTILE?: string;
    TURNSTILE_SITE_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
    CMS_OWNER_USERNAME?: string;
    CMS_PASSWORD_HASH?: string;
    RESEND_API_KEY?: string;
    CONTACT_TO?: string;
    CONTACT_FROM?: string;
    BUCKET?: R2Bucket;
  }
}
