# Production deployment requirements

Recorded owner preferences — 2026-10-26. These constraints govern deployment preparation. No production deployment or Cloudflare account change has been made.

- Canonical public address: https://jatinsinghrautela.com. Owner workspace: /cockpit.
- Target zero hosting/service charges. Do not enable paid plans, usage-billed subscriptions, automatic paid upgrades, or paid overages. Domain registration/renewal is a separate existing cost; do not promise the domain is free. Provider pricing and free tiers can change.
- The previous R2-based deployment proposal needs revision: R2 includes a free allowance but is a metered subscription, so it does not satisfy a strict guarantee against usage charges. Do not provision it under this requirement. Investigate a bounded, hard-stop free storage approach for CMS uploads, preserving the file-picker workflow where feasible; document limits before implementation.
- Prefer public pages and bundled assets served statically, so normal visits do not require CMS/database/server rendering. This requires adaptation of the current server-rendered application, including how CMS publications update public content. Keep dynamic endpoints within Workers/D1/Resend free limits; quota exhaustion must reject/degrade features rather than incur charges. Verify authentication CPU use against Workers Free limits.
- No keep-alive pings, synthetic traffic, uptime bots, scheduled browsing, or automated production simulations. Use deliberate local/pre-launch checks and real request logs instead.
- Apply available free bot mitigation, AI crawler blocking, abuse controls, and free Turnstile where appropriate. A request to block all crawlers also affects search-engine discovery. robots.txt is advisory, and no public-site bot detection can guarantee zero automated requests or zero false positives.
- Aim for continuous public accessibility without requiring the owner's computer or artificial engagement. Do not promise 100% uptime: free quotas, attacks, provider outages and policy changes can affect availability. Prioritize keeping static public content accessible if optional dynamic features hit limits.

References checked:
- https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/d1/reference/faq/
- https://developers.cloudflare.com/r2/get-started/
- https://developers.cloudflare.com/r2/pricing/
- https://developers.cloudflare.com/bots/get-started/bot-fight-mode/
