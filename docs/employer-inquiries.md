# Website inquiry forms

Employer inquiries require name, company email, phone and message. Company name, workforce requirement and website are optional. Contact inquiries require name, email, phone and comment; they do not ask for a website or subject.

Employer inquiries go to info@emeraldislemanpower.com, with admin@emeraldisle.lk and it@emeraldisle.lk copied. Contact inquiries go to info@emeraldislemanpower.com, with admin@emeraldisle.lk copied.

Both forms validate Turnstile, apply Supabase-backed rate limits, and save to the protected Supabase inquiry outbox. The request then attempts to send the queued message immediately through SMTP. Subjects use `[GENERAL CONTACT]` for general messages and `[CLIENT INQUIRY]` for employer hiring requests, followed by the sender's name or company and email. Contact notifications put the sender's email first in the message. Reply sends directly to the submitted email through `Reply-To`, while the verified company mailbox remains the sender. Transient failures remain queued for retry by the `/api/cron/inquiries` Vercel Cron Job; permanent or partial-recipient failures are flagged for attention. The cron endpoint requires `CRON_SECRET` and the sender requires `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` and optional `APPLICATIONS_EMAIL_FROM`.

The success card confirms the inquiry was saved for processing. The API attempts SMTP delivery immediately and the daily Vercel Cron Job retries eligible messages. SMTP acceptance does not prove inbox receipt; confirm delivery with the mail provider's logs and the recipients' inboxes.

The added bot verification, shared rate limiting, challenge replay protection, dashboard CAPTCHA changes and protected application-write migration were removed at the user's request. The migration had not been applied remotely, so no database rollback was required. Existing CV file validation and staff authentication/role checks are preserved.

Run node --test tests/employer-inquiry.test.cjs tests/application-input.test.cjs for local checks. SMTP is mocked; tests send no email.
