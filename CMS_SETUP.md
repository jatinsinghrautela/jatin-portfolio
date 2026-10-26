# Owner CMS and production setup

## Local owner login

- Open http://127.0.0.1:5173/control-room.
- The generated local username and password are in `outputs/cms-local-login.txt` (ignored by Git). Keep that file private.
- `.dev.vars` contains the local salted password hash and mail settings, also ignored by Git. There is no default/shared password and no public account registration.
- On a new checkout, run `node scripts/setup-local-cms.mjs` once to generate a new local login. It refuses to overwrite an existing secrets file.
- The owner username is `admin`; the public contact email is separate. The password is unchanged by this username migration.

## Editing

The CMS supports public copy, identity/SEO, image/file pickers, links, navigation labels, personal projects, architecture diagrams, workflows, experience, certifications, skills, professional practices, and separate terminal dialogues.

1. Select a section in the owner workspace. Expand nested entries to edit fields.
2. Add/remove/reorder list entries. For new projects, use **New project URL slug / Add project** so the corresponding case-study and workflow records are created together.
3. Keep slugs stable after publication. New project pages use `/projects/your-slug`. The fixed OpsRadar/Roach URLs still work; a removed project displays a not-found state.
4. Search **Page copy & media** by the visible text. Fields are grouped by the source component and include headings, descriptions, labels, and alternate text. Image fields show a file picker and visual library.
5. Use **Media library** to upload PNG, JPEG, WebP, or PDF files up to 6 MB. Choose a file directly in an image/media field, Identity → Resume, or Identity → Favicon. Existing artwork and uploaded files can be selected from the visual library. SVG uploads are intentionally excluded. Files uploaded here are public.
6. **Publish changes** writes to D1. Changes are not public until published. Other open tabs may need refresh. Concurrent edits are rejected instead of silently overwriting.
7. Use **Revision history** to load a previous publication, then publish it to restore. The last 20 previous revisions are retained.
8. Export content regularly as JSON. Import validates the document before loading it as an unpublished edit. Media URLs remain tied to the deployment's R2 bucket; back up media separately.

The CMS edits content, not application code, layouts, auth configuration, or sending credentials. Architecture diagrams support 1–24 component nodes with validated connection indexes. New custom general-purpose routes/layouts require development; new project pages are supported directly.

## Authentication and safeguards

- Login uses a salted PBKDF2-SHA256 password hash with 100,000 iterations. Passwords are never stored in site content.
- Sessions are opaque, stored as hashes in D1, HttpOnly, SameSite=Strict, Secure on HTTPS, and expire after eight hours.
- Changing the configured password hash invalidates existing sessions. Sign-out revokes the current session.
- Write requests require a matching Origin. Login is limited to five attempts per 15 minutes per client; contact submissions to five per hour. Cloudflare supplies the client address, which is hashed before rate-limit storage.
- Content is schema-validated, rendered as text/structured data, and blocks executable URL schemes. Uploads are authenticated and checked by file signature.
- No access is granted through the starter's local mock ChatGPT sign-in; CMS login is independent.
- Use HTTPS in production. Do not publish `.dev.vars` or the ignored login file.

## D1 and R2

`.openai/hosting.json` declares logical `DB` and `BUCKET` bindings. The existing Sites/Vinext integration connects them. Local data lives in ignored `.wrangler/state`, and is separate from production.

Generate/build before applying the initial local migration:

```sh
npm run db:generate
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_colorful_jack_flag.sql
```

Do not replay an already applied migration. No table creation occurs during web requests.

Before production, provision D1 and R2 and connect them under the same binding names. If deploying through Sites, use its supported provisioning/migration workflow. If deploying to your own Cloudflare account, replace the local placeholder database ID and bucket configuration with actual account resources before deployment; do not use the local placeholder configuration remotely. Apply the committed migration to the production database once. A production deployment has its own content and starts with `content/default.json` until the first CMS publication.

Configure production Worker secrets separately: `CMS_OWNER_USERNAME`, `CMS_PASSWORD_HASH`, `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`. Use the deployment's secret prompts/settings rather than putting secrets in Git or command arguments. Generate a separate strong production password/hash; do not reuse the local password. The hash format is `pbkdf2$100000$<16-byte-salt-hex>$<32-byte-hash-hex>`.

## Verification

`node scripts/test-cms.mjs` runs local HTTP integration checks using the ignored local login file. It performs temporary publications, tests a dynamically added project, validates uploads, tests origin/auth checks and stale writes, checks the unconfigured mail failure, restores the original document, removes its uploaded file, and signs out. It does not send email. It expects the local server and initialized D1/R2 bindings. Do not run it against production.

Generate a separate production owner login with `node scripts/generate-owner-credentials.mjs`. It writes ignored `outputs/production-owner-credentials.txt` and prints no secrets. Copy the username/hash into your production secret settings and keep the password private. This helper refuses to overwrite its existing output file.

`node scripts/test-contact.mjs` tests delivery acceptance/failure with a mocked email provider and sends no real mail.
Unused uploads can be removed from Media library. Files referenced by current content or a retained revision are protected from deletion.


## Adaptive content and route migration

The owner workspace is **Control Room** at `/control-room`. `/cms` redirects for existing links. API routes retain `/api/cms/...`; the route name is branding, not an authentication safeguard. Set `CMS_OWNER_USERNAME=admin` in production, replacing the earlier owner-email setting. The same salted password-hash/session protections remain.

Content cards use auto-fit grids, tags and labels wrap, and header navigation measures available space before choosing the compact menu. Featured projects appear on Home; use each project's **Featured** checkbox to control that list. Experience entries have their own Company field. Education is not displayed on Certifications.

Media fields have **Choose file** and **Choose from library** controls, image previews, and inline upload feedback. Uploading selects a draft file; publish to make the selection public. Library pages load progressively when there are more than 100 uploads.

For local growth checks, `node scripts/stress-content.mjs stage` temporarily publishes a larger test document and saves the previous document in ignored outputs. After browser checks, run `node scripts/stress-content.mjs restore`. Restore refuses to overwrite a concurrent publication. Do not run these checks against production.
