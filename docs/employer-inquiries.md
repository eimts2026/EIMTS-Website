# Website inquiry forms

Employer inquiries require name, company email and message. Company name, workforce requirement, website and phone are optional. Contact inquiries require all five visible fields.

Employer inquiries go to bd@emeraldisle.lk and admin@emerldisle.lk exactly as supplied. Contact inquiries go to info@emeraldisle.lk.

Both forms use the existing SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD and optional APPLICATIONS_EMAIL_FROM settings. They no longer depend on Turnstile, Redis or a Supabase server secret key.

The card flips only after SMTP accepts all recipients, clears the form and returns after six seconds. Back to form returns immediately. Errors retain the entered data. SMTP acceptance does not prove inbox receipt.

The added bot verification, shared rate limiting, challenge replay protection, dashboard CAPTCHA changes and protected application-write migration were removed at the user's request. The migration had not been applied remotely, so no database rollback was required. Existing CV file validation and staff authentication/role checks are preserved.

Run node --test tests/employer-inquiry.test.cjs tests/application-input.test.cjs for local checks. SMTP is mocked; tests send no email.
