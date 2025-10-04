# GCP Setup Guide for Gmail SMTP OAuth Credentials

Includes the common errors you encountered and how to fix them

Purpose
Get the five values your app needs:

```ts
const smtp_client_id: string = AppConfig.GMAIL.SMTP_CLIENT_ID;
const smtp_client_secret: string = AppConfig.GMAIL.SMTP_CLIENT_SECRET;
const smtp_refresh_token: string = AppConfig.GMAIL.SMTP_REFRESH_TOKEN;
const EMAIL_ID = AppConfig.GMAIL.EMAIL_ID;
```

This doc only covers generating those credentials and resolving the exact errors you hit while doing it.

---

# Step 0 — quick facts you must know

- Correct SMTP scope for full Gmail access: `https://mail.google.com/`
- Use exactly `https://developers.google.com/oauthplayground` as the redirect URI for testing with OAuth Playground. It must match exactly.
- Store client id, secret, and refresh token securely. Do not hardcode them.
- Free Gmail has daily sending limits. This flow is fine for a single account and low volume.

---

# Step 1 — create project and enable Gmail API

1. Open Cloud Console.
2. Create a new project or pick an existing one.
3. Go to **APIs & Services → Library** and enable **Gmail API**.

---

# Step 2 — configure OAuth consent screen

1. Go to **APIs & Services → OAuth consent screen**.
2. Choose **External**.
3. Fill App name, user support email, developer contact email. Save.
4. Important: under Audience > **Test users** add the Gmail address you will use to authorize and send from. Save.

Why this matters
If your app is in Testing mode and your Gmail is not added as a Test User you will get a 403 access_denied error. See troubleshooting below.

---

# Step 3 — create OAuth client ID and authorized redirect URI

1. Go to **APIs & Services → Credentials**.
2. Click **Create Credentials → OAuth client ID**.
3. Choose **Web application**. Name it.
4. Under **Authorized redirect URIs** add exactly this:

```
https://developers.google.com/oauthplayground
```

5. Click Create and copy **Client ID** and **Client Secret**.

---

# Step 4 — use OAuth 2.0 Playground to generate tokens

1. Open: [https://developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)
2. Click the gear icon in the top right.
3. Check **Use your own OAuth credentials**. Paste the Client ID and Client Secret you got in Step 3. Close the settings.
4. In Step 1, expand **Gmail API v1** and check **[https://mail.google.com/](https://mail.google.com/)** only.
5. Click **Authorize APIs**. You will be redirected to Google sign in. Sign in with the Gmail account you added as a Test User.
6. In Step 2, click **Exchange authorization code for tokens**. The Playground will return a JSON that contains `access_token`, `refresh_token`, `expires_in`, `scope`, etc.
7. Copy the `refresh_token` value.

Where to find the refresh token in the response
Example response fragment you already saw:

```json
{
  "access_token": "ya29....",
  "expires_in": 3599,
  "scope": "https://mail.google.com/",
  "refresh_token": "1//04kMZ...<long-token>..."
}
```

Use the `refresh_token` field value for `smtp_refresh_token`.

Common error you saw and fixes

- **Error: invalid_scope**

  ```
  Error 400: invalid_scope
  Some requested scopes were invalid. valid=[https://mail.google.com/], invalid=[mail, scope, full]
  ```

  Cause: you supplied invalid scope strings such as `mail` or `full`.
  Fix: select only the exact scope `https://mail.google.com/` in OAuth Playground. Do not manually type other words.
- **Error: access_denied / app not verified**

  ```
  Error 403: access_denied
  The app is currently being tested, and can only be accessed by developer-approved testers.
  ```

  Cause: the OAuth app is in Testing mode and the signing Gmail is not a Test User.
  Fix: In the OAuth consent screen add your Gmail as a Test User. Save. Retry the authorize step with that same Gmail account.
- **Error: redirect_uri_mismatch**
  See Step 3 fix. This one appears when the redirect in the auth request does not match exactly what you registered.

---

# Step 5 — map the values into your app

After Step 4 you have everything you need.

Final mapping

```ts
const smtp_client_id = "<Your OAuth Client ID from GCP>";
const smtp_client_secret = "<Your OAuth Client Secret from GCP>";
const smtp_redirect_url = "https://developers.google.com/oauthplayground";
const smtp_refresh_token = "<Refresh Token copied from OAuth Playground>";
const EMAIL_ID = "your@gmail.com";
```

Add them to your secret store or environment variables. Do not commit them to source control.

---

# Extra: how to request a refresh token that does not expire weekly

What you observed
Your token response included `refresh_token_expires_in: 604799`. That is 7 days. Google may issue short-lived refresh tokens when the app is in Test mode or when some OAuth parameters are not present.

How to get a long-lived refresh token

1. In your OAuth request add these query parameters:

   - `access_type=offline`
   - `prompt=consent`
     Example authorization URL:

```
https://accounts.google.com/o/oauth2/v2/auth?
 response_type=code
 &client_id=<YOUR_CLIENT_ID>
 &redirect_uri=https://developers.google.com/oauthplayground
 &scope=https://mail.google.com/
 &access_type=offline
 &prompt=consent
```

2. Use that URL to sign in and exchange the code for tokens.
3. If your app is still in Testing mode Google may still issue short-lived refresh tokens. To avoid this, move the OAuth consent screen to Production. Note that for `https://mail.google.com/` Google may require app verification before you can publish. For a single account you can instead use Test Users and keep reauthorizing when the short token expires.

Important note
If you only need to send from a single Gmail account and want the simplest stable path, consider using an App Password instead of OAuth. An App Password requires turning on two-step verification and works with SMTP username/password. That avoids refresh token complexity. It is not OAuth and it is available only for Google accounts with 2FA enabled. Use App Password only if it fits your security policy.

---

# Minimal test snippet to verify credentials (optional)

Use this only to test that refresh token works. Example with Nodemailer:

```js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_ID,
    clientId: process.env.SMTP_CLIENT_ID,
    clientSecret: process.env.SMTP_CLIENT_SECRET,
    refreshToken: process.env.SMTP_REFRESH_TOKEN,
  },
});

await transporter.sendMail({
  from: `Your App <${process.env.EMAIL_ID}>`,
  to: "recipient@example.com",
  subject: "Test SMTP OAuth",
  text: "If you get this, tokens work.",
});
```

If you get an auth error, re-check scopes, test user, redirect URI, and that the refresh token string is exact.

---

# Troubleshooting summary — the exact errors you hit and fixes

1. `redirect_uri_mismatch`

   - Cause: redirect URI in OAuth request not in your OAuth client authorized redirect URIs.
   - Fix: Add exact URI `https://developers.google.com/oauthplayground` or your app URL in the client settings.
2. `access_denied` with message about app not verified and testing mode

   - Cause: app is in Testing mode and your Gmail is not a Test User.
   - Fix: Add your Gmail address under OAuth consent screen → Test users. Sign in with that account.
3. `invalid_scope` listing `mail, scope, full`

   - Cause: invalid or mistyped scope values.
   - Fix: use the exact scope `https://mail.google.com/` only.
4. No `refresh_token` or `refresh_token_expires_in` short lifetime

   - Cause: missing `access_type=offline` or app in testing state. Google can give short-lived refresh tokens for testing.
   - Fix: request `access_type=offline` and `prompt=consent` in the authorization request. For long term, publish app to Production and complete verification if required. Alternatively use App Password for a single account.

---

# Security and operational notes

- Keep client id and secret and refresh token in a secret store. Use Secret Manager or environment secrets.
- Refresh tokens can be revoked via account security settings. If you lose email sending, check account security or revoke list.
- Free Gmail sending limits apply. Monitor bounces and limits.
- If you plan to scale or send bulk messages use a proper transactional mail provider.

---

# Final checklist before you finish

- [ ] Gmail added as Test User under OAuth consent screen.
- [ ] OAuth client has redirect URI `https://developers.google.com/oauthplayground` or your actual redirect URI.
- [ ] Scope selected exactly: `https://mail.google.com/`.
- [ ] Used OAuth Playground with your own client id and secret and exchanged code for tokens.
- [ ] Copied `refresh_token` into secrets store.
- [ ] Confirmed sending with a test mail client or the Nodemailer snippet.

---

If you want, I can:

- produce a one page printable PDF of this doc, or
- convert this into a small step by step checklist with screenshots of the exact Console clicks.

Which would you like me to make next?
