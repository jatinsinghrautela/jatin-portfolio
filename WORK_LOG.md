# Work log

## 2026-10-26 - Source review

- Found existing Home, Projects, About, and Contact routes with shared portfolio components.
- Confirmed glass architecture artwork, persisted theme controls, code tabs, filters, and reduced-motion-aware typing terminals.
- Read the supplied resume for roles, skills, projects, education, and certification.
- Git working tree started clean. No remote is configured.
- Connected GitHub identity: Jatin Singh Rautela (`jatinsinghrautela`), jatinsinghrautela@gmail.com. Existing global Git identity differs; use repository-local settings for new commits.

## 2026-10-26 - Personalization and validation

- Replaced sample profile copy across all four pages with resume facts.
- Added Comviva role history, resume-reported impact metrics, education, certification, OpsRadar, and Roach.
- Preserved glass visuals, separate routes, light/dark controls, code tabs, and animated typing terminals.
- Personalized profile terminal; kept delivery examples clearly marked as simulations.
- Added resume download and email draft form. Sending requires the visitor's email app; there is no contact backend.
- Updated page title and description, and added responsive stats/contact layouts.
- TypeScript check passed: `node node_modules/typescript/bin/tsc --noEmit`.
- Production build passed: `node scripts/run-framework.mjs build`.
- Local preview: http://127.0.0.1:5173/ (`node scripts/run-framework.mjs dev`). Server required local networking permission.
- Browser review confirmed the personalized home layout, theme toggle and persistence across navigation, project filter, and expanded project details.
- GitHub push pending: checkout has no remote; asked user for repository URL. No portfolio repository found under the connected account.
- HTTP verification passed: Home, About, Projects, Contact, and resume download all returned 200.

## 2026-10-26 - GitHub repository connection

- User supplied destination: https://github.com/jatinsinghrautela/jatin-portfolio.
- Checked the remote with `git ls-remote`; it contains no refs, so no remote history needs reconciliation.
- Configure `origin` and push local `main` with upstream tracking, without force pushing.
- New commits use Jatin Singh Rautela <jatinsinghrautela@gmail.com>, matching the connected GitHub profile. Imported historical commits retain their original authors.
- Push succeeded: main now tracks origin/main. Earlier pending-push notes are resolved.

## 2026-10-26 - Contributor history cleanup

- Identified three imported source commits authored by forbiddenlinkers22. GitHub contributor attribution came from this imported history.
- Saved the original history locally in outputs/before-contributor-cleanup.bundle (ignored by Git).
- Prepared a new parentless snapshot of the current portfolio under Jatin Singh Rautela's verified Git identity, rather than reassigning authorship of individual imported commits.
- Replacing remote main is pending explicit approval because it rewrites published history. Use a lease against 39774230122bab9b83ae26aa70307500b376e295 to reject unexpected remote changes.

## 2026-10-26 - Approved history replacement and identity guard

- User explicitly approved replacing the published main history with the prepared snapshot.
- Kept repository-local author and committer defaults set to Jatin Singh Rautela <jatinsinghrautela@gmail.com>.
- Added a tracked .githooks/pre-commit guard requiring the verified identity for both author and committer, including environment overrides.
- Enable the guard in this checkout with `git config core.hooksPath .githooks`. Future clones must run that command too. Git hooks can be explicitly bypassed, so this is a local safeguard, not a GitHub enforcement rule.
- Original history remains recoverable from outputs/before-contributor-cleanup.bundle.
- Completed guarded force push. Remote main contains only the fresh snapshot and subsequent commits authored and committed by the verified account. Local and remote tips matched after verification.
- Guard validation passed with bundled Git: verified identity returned 0; forbiddenlinkers22 identity was rejected with exit 1. The default system Git lacks the hook subcommand; bundled Git was used for direct hook testing.
- Follow-up: GitHub API confirms main is the default branch and its complete three-commit history maps author and committer only to jatinsinghrautela. GitHub documentation says contributor displays can take about 24 hours to refresh after history rewrites. The sidebar may therefore remain stale temporarily.

## 2026-10-26 - Focused pages and visual refresh

- Added /experience, /skills, and /credentials. About now focuses on the person; Home is a shorter introduction with selected work and links to deeper pages.
- Moved role history to a glass timeline with a travelling highlight, pulsing milestones, staggered entrances, and animated role workflow markers. Reduced-motion CSS disables the animations.
- Replaced visible Studio branding with a jr. monogram and Jatin / DevOps Engineer identity; updated metadata and favicon.
- Replaced the text theme control with an animated celestial switch: sun, clouds, moon craters, and stars. Preserved persisted theme preference and accessible name / pressed state.
- Retained typing terminals on About, Skills, and Projects, as well as code tabs and project filtering.
- Generated two original conceptual illustrations with the built-in image tool, inspected them, and integrated optimized WebP assets. Prompt set and provenance are in ASSETS.md. No copyright-free or exclusivity guarantee is claimed.
- TypeScript and production build passed. All seven routes and both image URLs returned HTTP 200.
- Browser review confirmed About separation, Experience layout, Skills content, Credentials layout, new navigation, sun/moon interaction, and theme persistence. Reviewed light and dark appearances in the current narrow browser viewport.

## 2026-10-26 - Repository-informed OpsRadar and Roach

- Reviewed user-provided LongShot and Roach READMEs plus architecture / project documentation. Sources and interpretation are recorded in PROJECT_SOURCES.md.
- Replaced OpsRadar React Native / metrics-platform copy with the actual React web console, Express API, PostgreSQL, Node agent, alert, heartbeat, and retention architecture. Presented the new name and noted the previous LongShot / AlertOn implementation name in details.
- Replaced the generic Roach template copy with private shop inventory, QR scanning, restock, checkout, invoices, reporting, notifications, and offline access-payment management.
- Gave each project an independent case study with features, architecture components, and source status. Used neutral product descriptions without claiming sole authorship or inventing individual responsibilities.
- OpsRadar planned source URL is displayed as a clearly marked unpublished placeholder. Roach links to https://github.com/diwakar767/Roach.
- Moved shared project data and cards into focused components. Home now features OpsRadar and Roach; professional delivery experience remains on Projects.
- Generated, visually inspected, and integrated two new original conceptual covers with the built-in image tool, optimized to WebP. Prompts and provenance are recorded in ASSETS.md.
- TypeScript and production build passed. Browser checks confirmed both detail panels, full feature lists, source link, placeholder status, and cover placement.
- Final checks: category filter passed; Home, Projects, and both new images returned HTTP 200. Repeated TypeScript and build after the final architecture-label refinement; both passed.

## 2026-10-26 - Roach source placeholder

- Replaced the website's external Roach source link with https://github.com/jatinsinghrautela/Roach, displayed as an unpublished placeholder like OpsRadar.
- Updated the shared placeholder message to use the actual project title.
- Original repository references remain in PROJECT_SOURCES.md for content provenance only.
- Validation: TypeScript and diff checks passed; browser confirmed the Roach coming-soon label and planned jatinsinghrautela/Roach URL with no external source button.

## 2026-10-26 - Dedicated project case-study pages

- Replaced expandable project cards with concise ideas and accessible links to /projects/opsradar, /projects/roach, and /projects/pipeline. Home and Projects use the same compact cards.
- Extracted shared header navigation so detail pages preserve site branding, theme controls, and active Projects navigation.
- Added overview, architecture, visual tour, technologies, and learnings sections with direct hash links, scroll-linked active state, a sticky section menu, and reading progress.
- Added animated section reveals that follow scroll direction and work when revisiting sections. Motion preferences disable reveal blur/translation and diagram movement; all text remains visible without JavaScript.
- Added accessible SVG component diagrams with animated signal paths and written architecture explanations. Professional delivery diagram is explicitly conceptual, based on resume-backed tools.
- Inspected both repository trees for application screenshots; only branding/marketing images were present. Visual tours are clearly labeled illustrative interface studies with sample data, not actual screenshots. No fabricated screenshots or personal learning claims were added.
- Preserved coming-soon personal GitHub URLs for OpsRadar and Roach. Added next-project and all-projects navigation.
- TypeScript and production build passed. Projects and all three detail routes returned HTTP 200.
- Browser checks verified card navigation, direct section links, automatic active sections, upward direction detection, progress updates, visual-tour switching, return navigation, Roach content, and theme toggle. Reviewed narrow-screen layout and OpsRadar diagram.
- Final dark-theme review confirmed Technologies tracking and no horizontal document overflow in the current browser viewport.

## 2026-10-26 - Theme, navigation, content, and card polish

- Added a theme bootstrap script in the document head to restore the saved theme before painting; it falls back to the system preference. Theme writes handle unavailable local storage, and cross-tab changes stay synchronized.
- Changed internal page links to Next Link so navigation preserves the current document and theme rather than reloading it. Browser checks confirmed dark navigation, dark hard refresh, and light navigation.
- Kept only OpsRadar and Roach in personal Projects. Removed the professional delivery project card and redirected its old detail URL to Experience. Experience contains no OpsRadar or Roach references; its CTA leads to Contact.
- Changed the home eyebrow to DEVOPS and updated shared branding to DevOps Engineer.
- Added a compact main-navigation disclosure below 1180px, with close-on-selection, Escape handling, outside-click handling, and accessible expanded state. The case-study section menu also collapses on narrow screens.
- Renamed the page and navigation to Certifications at /certifications. /credentials redirects for existing links. Added the exact Credly verification URL provided by the user. The web reader could not independently inspect the Credly page; browser checks verified the website's outgoing verification href.
- Added the user-supplied LinkedIn and Instagram links, existing verified GitHub profile, email, phone, and resume link through a shared responsive footer and Contact links.
- Refreshed project cards with rounded glass panels, layered rings, floating project glyphs, image zoom, hover lift, and animated arrows; added graphic treatments to skills, practice, experience, and certification cards. Reduced-motion overrides are included.
- Removed the generic code snippets, fake deployment session, and invented application tables. Replaced them with resume-backed engineering practices and animated product workflow diagrams. Preserved the factual animated profile terminal.
- TypeScript and production build passed. Eleven current/legacy route checks succeeded, including followed redirects. Browser checks verified menus, closing section selection, workflow controls, both themes, updated personal project labels, certification/social hrefs, and no horizontal overflow in the current narrow viewport.
- Restarted the local development server after the framework's hot-reload module graph became stale; preview remains at http://127.0.0.1:5173/.

## 2026-10-26 - Owner CMS, contact delivery, privacy, and identity

- Centralized public content in content/default.json, including 147 active copy/media/link fields plus identity, navigation, social links, projects, case studies, workflows, roles, certifications, education, skills, practices, toolbox, and separate terminal dialogues. Removed stale duplicate data modules.
- Added /cms with independent password authentication, HttpOnly expiring sessions, searchable form editing, add/remove/reorder collections, project creation, media upload/removal, import/export, optimistic publishing, and 20 retained revisions.
- Added D1 schema/migration and R2 binding. Local storage initialized; no production resource or hosting deployment was performed. New project slugs resolve through a dynamic route.
- Protected write APIs with origin checks, hashed session tokens, password-derived session invalidation, validation, rate limiting, and upload signatures. Local secret files and ignored outputs are denied by Vite (verified 403).
- Added server-side Resend contact delivery with a server-fixed recipient, visitor Reply-To, idempotency, validation, honeypot/minimum fill time, rate limiting, and explicit failures. No provider key was supplied; no real email was sent. Actual forwarding/sending setup remains an owner action.
- Changed public email to contact@jatinsinghrautela.com. Removed phone links and number, including true redaction from the public downloadable PDF; updated its contact line and visually checked the rendered page. The original Downloads PDF was preserved.
- Added full-name responsive branding with animated orbital accents, a new JR favicon, modern SVG social icons, and two custom SVG cursors with system fallbacks. Text inputs retain the text cursor; coarse pointers are unaffected.
- Gave About a profile/mindset terminal and Skills a capability/offering terminal. All dialogue lines are editable. Motion respects the existing reduced-motion setting.
- Added CMS_SETUP.md and EMAIL_SETUP.md with owner access, deployment bindings/secrets, Cloudflare forwarding to Gmail, sending-domain verification, and Resend configuration. No credentials are committed; local login details are in ignored outputs/cms-local-login.txt.
- Verification: TypeScript and production build passed; 26 HTTP integration assertions passed for auth, CSRF, schema validation, content persistence, save conflicts, restoration, dynamic project pages, uploads, and logout; 9 mocked email-provider checks passed. Temporary publications/media were restored or removed, then local test revisions/sessions were cleared.
- Browser checks: owner login/logout, copy search, content sections, full-name header, domain email links, no phone links, custom cursor with native fallback, responsive layout without overflow, and honest unavailable-delivery form response. Public routes, CMS, cursor assets, and resume returned 200.
- Final checks also confirmed .dev.vars and the ignored local login file return HTTP 403, the public PDF text contains no phone number, and generated credential values are absent from commit candidates.

## 2026-10-26 - Adaptive layouts and Control Room refinements

- Moved the owner workspace to /control-room; /cms redirects for compatibility. Login now uses CMS_OWNER_USERNAME=admin instead of an email address. Updated local setup/generation scripts, tests, and the ignored local login details while preserving the existing password/hash.
- Added auto-fit grids for projects, skills, certifications, practices, technology cards, and page links; wrapping for growing tags/toolboxes/labels; intrinsic-width safeguards for long text; and measured navigation that chooses a compact menu when content no longer fits.
- Added Featured project controls for Home and per-entry Company fields for experience. Schema defaults normalize previously saved documents without discarding those publications.
- Extended architecture diagrams to 1–24 nodes and up to 80 validated connections, with computed diagram size and wrapping node content. The diagram remains locally scrollable on narrow displays instead of widening the page.
- Added MediaPicker controls directly to image, favicon, and resume fields: native file chooser, current preview, visual library, inline uploads, and progressive library loading. Removed path typing and raw-path display from the media library.
- Replaced the bulky cursor with an 18×22 outline arrow; links/buttons use native pointer and readable content/form fields use native text cursors. Kept system fallback and touch behavior.
- Added hover/focus feedback to cards, navigation, controls, skill pills, workflow nodes, and media choices. Reduced-motion and coarse-pointer behavior remain protected.
- Removed education cards and education copy from the Certifications screen. Removed the now-unused Education editor section; retained stored legacy data for compatibility.
- Validation: 27 HTTP integration assertions passed, including username login and rejection of email-based login; 9 mocked email checks passed; TypeScript and production build passed.
- Published temporary local growth-test content: 12 skill groups with 213 total tags, 10 projects, 6 certifications, 8 practice cards, 12 navigation entries, and a 10-node diagram. Browser checks found no horizontal page overflow in the current narrow viewport. Restored original content and removed only marked test-history/rate-limit records.
- Browser verified Control Room login, media preview/library controls, selecting and publishing the existing favicon, and no raw media text inputs. The password was not printed or committed.

## 2026-10-26 — Local Resend configuration
- Owner confirmed domain verification and successful Cloudflare forwarding.
- Checked local Resend key presence/format without displaying its value; sender and recipient match the intended domain/Gmail setup.
- Started development server with .dev.vars and confirmed /contact returns HTTP 200.
- Real provider delivery and Reply-To remain to be checked with a contact-form submission; no test email sent by the agent.


## 2026-10-26 — Portfolio usability, search, and owner settings
- Removed image caption overlays, decorative section/workflow/card numbering, and unused image text overlays; retained meaningful dates and technical quantities.
- Shared pages now use normal document flow with responsive bottom spacing. The glass navigation remains sticky; case-study section navigation clears it. Project filters wrap at phone widths.
- Corrected the inherited margin that shifted JR away from the orbit center. Nav hit areas no longer translate on hover, and their descendants inherit a consistent pointer cursor.
- Added public content search with Ctrl/Command K, global/page scopes, Escape, keyboard selection, focus restoration, and page-result scrolling. Home defaults to global search; other public routes default to their current content. The index rebuilds from published CMS content and excludes the owner workspace.
- Experience is sorted newest first with ongoing roles first, grouped by company with visible organization headings. The owner's additional Abcd entry and all other content were preserved.
- Added looping hover glow/light/icon effects and separate sending/provider-accepted email animations, with reduced-motion support. No real email was sent for these checks.
- Shortened owner route to /hq; /control-room and /cms redirect. Added theme controls on login and editor, and current-password-protected password changes. Only salted hashes persist in the new owner_settings table; successful changes revoke all sessions. Username stays admin.
- Generated migration 0001_milky_kree.sql and applied it locally only. Production must apply this migration before the release is deployed. Existing local owner password remains unchanged.
- Validation so far: TypeScript and production build pass; 27 local CMS HTTP checks pass and restore the original content; 9 mocked contact checks pass; 18 isolated password/security checks pass; experience grouping/date tests pass. Password tests never modify the actual owner password.
- Responsive verification used a temporary same-origin iframe harness at 320, 768, and 1440 pixels for Home, Projects, Experience, Skills, Certifications, About, Contact, both project detail pages, and owner login. All had no page-level horizontal overflow after fixing wrapping filters. Architecture scroll is contained within its diagram. Public-page footer clearance was 48–112 pixels depending on viewport and page. Expanded content included ten projects, twelve skill groups, six certifications, and ten architecture nodes.
- Restored the owner's original document after growth checks with the version guard; removed the temporary harness. Browser checks verified global search via Ctrl K, page search and selection, sticky nav top position while scrolled, centered orbit margin, and absence of image labels/decorative numbering.
- Cleared only local test throttle counters, signed in at /hq with the existing local credential, checked the Password & security form, toggled the editor theme and restored it, then signed out. No owner password was changed. Secrets scan confirmed no local password/hash or Resend key in commit candidates.
- Final search review: exact title matches rank before mentions in page text, so a project search leads with its case study. Final TypeScript check passed.
