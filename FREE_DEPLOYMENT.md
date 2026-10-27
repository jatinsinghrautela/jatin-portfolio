# Free-only deployment to jatinsinghrautela.com

This is the production guide. It supersedes the earlier R2/Vinext hosting proposal. No R2 subscription, paid Workers plan, paid overages, keep-alive pings, scheduled visits, or production test traffic is required. Domain renewal remains a separate cost. Provider free tiers can change; zero bot traffic and uninterrupted uptime cannot be guaranteed.

## Confirmed account setup

- Account: `69c89f1a116f9f8708a9d824b70d9f8f`.
- D1: `portfolio-db`, ID `600234d5-882b-4f45-943e-e7ae9640a325`, binding `DB`.
- Owner confirmed **Workers Free / no paid Workers subscription** on 2026-10-26. OAuth can deploy Workers but cannot read billing subscriptions. The local confirmation is ignored by Git; recheck Billing → Subscriptions before changing account plans.
- Turnstile site key is configured publicly in `wrangler.free.jsonc`. Its secret belongs only in Cloudflare secrets.
- Initial live content will use curated GitHub defaults, as requested; the local “Abcd” role is not included. Local content and production content are separate.

## How publishing works

Public pages are pre-rendered static HTML with a small React client. Static assets are served before the Worker. On a full page load, the client makes one request to `/api/content` to pick up CMS publications. That public response is cached for 30 seconds at each Cloudflare location. Internal navigation does not fetch page HTML or poll the database. Owner-authenticated content requests bypass that public cache.

In `/cockpit`, **Publish changes** writes the new document to D1. New public visits or a refresh receive it within about 30 seconds under normal operation. Publication also clears the cache at the serving Cloudflare location; other locations expire within that window. Code changes require a new build/deployment. New CMS projects use the same static application shell and their published project data.

If the API is unavailable or a free quota is exhausted, bundled public content remains visible, or a previously saved public document from that browser is used. A visitor who has never loaded a newly added project may not see it until API access recovers. CMS/contact/uploads can be unavailable when backend quotas are reached. Static delivery avoids making core public page availability depend on each database read. It is not a 100% uptime or permanent-free guarantee.

## Media and email limits

- File picker/library is retained; uploads go into D1, not R2.
- Maximum file size: **1 MB** (PNG, JPEG, WebP, PDF). Compress larger images/PDFs before uploading.
- Maximum library: **100 files / 50 MB**. The API stops accepting uploads at either limit rather than provisioning paid storage.
- Bundled images and resume do not consume this upload allowance.
- Current publications and retained revisions protect referenced uploads from deletion.
- Contact forms require server-verified Turnstile. Application email budgets stop at 90 attempts/day and 2,700/month; unsuccessful attempts can consume budget. Resend must remain on its Free plan, with paid overages disabled. Other applications using the same Resend account share its provider limits.

## Owner action: enter the Turnstile secret

After the private Worker has been prepared, run in PowerShell:

```powershell
cd "D:\Personal Projects\Portfolio"
npx wrangler secret put TURNSTILE_SECRET_KEY --config wrangler.free.jsonc
```

At the secret prompt, enter the **secret key** from your `Portfolio forms` Turnstile widget. Do not put it in a command argument, paste it into chat, or commit it. The widget must allow `jatinsinghrautela.com`; use Managed mode. The site key is public and already configured.

The other production secrets are `CMS_PASSWORD_HASH` and `RESEND_API_KEY`. The preparation helper can install these from local private files without printing values. The separate generated production owner login is in ignored `outputs/production-owner-credentials.txt`; keep it private. Username is `admin`. After signing in, you can change the password in Cockpit → Password & security. Your local login password is separate.

Check installed secret **names only** with:

```powershell
npx wrangler secret list --config wrangler.free.jsonc
```

## Production preparation and publication

The normal preparation sequence, run once on the confirmed Free account, is:

```powershell
npm run build:free
node scripts/provision-free.mjs --dry-run
node scripts/provision-free.mjs
npx wrangler d1 migrations apply DB --config wrangler.free.jsonc --remote
node scripts/upload-free-secrets.mjs
```

`provision-free.mjs` refuses to overwrite an existing Worker. It creates `jatin-portfolio` with no public route, workers.dev address, or preview URLs. It does not subscribe to a plan. Migration commands apply only unapplied SQL migrations. The secrets helper creates a separate strong production owner credential if missing, uploads only its hash and the local Resend key to the Worker, and deletes its temporary upload file. It never uploads plaintext owner passwords.

After all secrets are present and checks pass:

```powershell
npm run build:free
npm run deploy:free
```

The guarded deployment verifies configuration, the Free-plan confirmation, and required secret names before invoking Wrangler. It then attaches **https://jatinsinghrautela.com** as the custom domain. Existing Cloudflare Email Routing MX, Resend CNAME/TXT, and other unrelated DNS records are not replaced. If an existing web A/AAAA/CNAME conflicts, stop and review that specific web record; do not delete mail records.

The OAuth login cannot read billing. A successful plan check here can mean the recorded owner confirmation, not an independently verified subscription. If billing read access is available, a paid/non-free Workers subscription blocks deployment. For CI, the owner must recheck Free and explicitly set `WORKERS_FREE_CONFIRMED=true` in Cloudflare build variables. This is an attestation, not a spending cap. Never use this workflow on a paid Workers account.

## Owner action: free bot protection

In the `jatinsinghrautela.com` zone, open **Security → Settings** and filter by **Bot traffic**:

1. Enable **Bot Fight Mode** on the Free plan.
2. Under **Configure AI bot policies**, set **Training**, **Agent**, and **Search** to **Block on all pages** (older dashboards may call this Block AI bots). Do not choose a paid Bot Management/Super Bot Fight Mode upgrade.
3. The site already serves `robots.txt` with `Disallow: /` and noindex/nofollow metadata to discourage all crawlers, including search engines. This reduces search-engine discovery and is not an access-control barrier.
4. Use the available free security/custom-rule controls if further verified-crawler blocking is wanted; do not add a paid rule feature. Bot detection is imperfect and challenges can occasionally affect legitimate clients.
5. Verify Turnstile on the Contact form and Cockpit sign-in manually after launch.

Automatic DDoS protection is provided by Cloudflare. None of these controls can guarantee every automated request is blocked. No production browser simulations or monitoring pings are scheduled.

## Owner action: automatic GitHub deployments

After the first successful release, open Cloudflare → Workers & Pages → `jatin-portfolio` → Settings → Builds, and connect `jatinsinghrautela/jatin-portfolio` on branch `main`. Keep Workers/builds on Free and do not enable paid overages or upgrades.

Use:

- Root directory: repository root.
- Build command: `npm run build:free`.
- Deploy command: `npm run deploy:free`.
- Build variable: `WORKERS_FREE_CONFIRMED=true`, only after checking the account is still Free.
- Node: 22.13 or newer.

Runtime secrets are configured on the Worker; do not paste them into repository files. Cloudflare's Git integration authenticates its own deployment token. A normal push can deploy code automatically after this connection is enabled. CMS content publications do not require a GitHub commit or a build. Build quotas can delay code deployment; keep paid build options off.

## Local review and verification

```powershell
npm run db:free:local
npm run build:free
npm run preview:free
```

Open http://127.0.0.1:5174. This uses a separate local D1 state directory and intentionally disables Turnstile only in the local environment. Production requires it and fails closed when the secret is missing. The original Vinext development site at port 5173 is retained.

Checks:

```powershell
node node_modules/typescript/bin/tsc --noEmit
node scripts/test-contact.mjs
node scripts/test-owner-password.mjs
node scripts/test-free.mjs
node scripts/test-free-cache.mjs
node scripts/test-cms.mjs --static
```

The HTTP CMS checks temporarily modify and restore only the local preview document. Tests do not send real email. Test scripts must not target production.

After launch, manually check HTTPS, several pages, a Cockpit sign-in, a small upload, publication from a fresh tab, and a real contact submission. Check Cloudflare Worker metrics for CPU-limit errors after your actual usage, especially password hashing; if encountered, retain strong authentication and ask for a free-compatible fix rather than upgrading the plan or weakening the password hash.

Official references:
- https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/d1/platform/limits/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.cloudflare.com/bots/get-started/bot-fight-mode/
