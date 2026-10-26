# Domain email and contact form setup

The website now publishes **contact@jatinsinghrautela.com**. Its contact form sends to a backend; visitors do not need to open an email app. Actual email delivery needs the setup below. Until sending is configured, the form gives an honest delivery-unavailable response; it does not pretend a message was sent.

## 1. Receive domain email in your existing Gmail

1. Sign in to your Cloudflare dashboard.
2. Open **Compute → Email Service → Email Routing** (some dashboard versions expose Email Routing from the domain's Email section).
3. Onboard `jatinsinghrautela.com` and review the DNS records Cloudflare proposes. Preserve any existing unrelated DNS records.
4. Add `jatinsinghrautela@gmail.com` as a destination and complete the verification email sent to that inbox.
5. Create a routing rule for `contact@jatinsinghrautela.com` pointing to that verified Gmail destination.
6. Send a test from another email account to the contact address and check Gmail, including spam.

Forwarding provides receipt into Gmail. Sending replies *as* contact@ is a separate SMTP/mailbox configuration; ordinary Gmail replies may use your Gmail address.

Official instructions: https://developers.cloudflare.com/email-service/get-started/route-emails/

## 2. Enable the website's outbound form delivery

The implemented provider is Resend. The owner has verified the domain and added a local API key. Production credentials remain separate.

1. Create/access your Resend account and add a domain you own.
2. Verify sending for `jatinsinghrautela.com` using the exact DNS hostnames and values Resend supplies in Cloudflare DNS. Use sending verification only; keep inbound/root MX records with Cloudflare Email Routing. Do not replace those MX records with a second receiving provider.
3. Wait for Resend to report the sending domain verified.
4. Create a restricted sending API key for the verified domain. Store it in the production Worker's `RESEND_API_KEY` secret. Do not paste it in chat or commit it.
5. Set these server-side values:

```text
CONTACT_FROM=Jatin Portfolio <contact@jatinsinghrautela.com>
CONTACT_TO=jatinsinghrautela@gmail.com
RESEND_API_KEY=<secret from your sending provider>
```

For local testing, add the key to ignored `.dev.vars` and restart the dev server. Production secrets must be configured separately.

The form sends from the verified domain to your Gmail directly. The visitor's address goes in Reply-To. Direct messages to contact@ use Cloudflare's forwarding rule. The receiving address is fixed server-side and cannot be chosen by a visitor.

Official domain setup: https://resend.com/docs/dashboard/domains/introduction
Official sending API: https://resend.com/docs/api-reference/emails/send-email

## 3. Verify before launch

- Submit a real form message only after the sending configuration is ready, then check inbox/spam and provider delivery logs.
- Confirm Reply-To contains the visitor's address.
- Check failure behavior with a missing/invalid provider key; success appears only after the provider accepts a message.
- Keep the website on HTTPS with the correct D1 rate-limit database binding.

The handler validates lengths and email shape, enforces matching request Origin, uses a honeypot and minimum fill time, limits submissions, and supplies an idempotency key to the email provider. These controls reduce abuse; a public launch can additionally use Cloudflare WAF/Turnstile if traffic warrants it. Provider acceptance is not a guarantee of inbox placement.
