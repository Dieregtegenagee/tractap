# tractap
TRACTAP is a live DJ song-request platform.

# TRACTAP frontend

Plain HTML/CSS/JS — no build step. Talks to the `tractap-backend-php` API over REST,
and refreshes the live queue by polling every 3.5s (no persistent WebSocket needed,
so it runs fine on shared hosting).

## 1. Point it at your backend

Edit `config.js`:

```js
window.TRACTAP_API_BASE = "https://your-domain.com/api/";
window.TRACTAP_APP_URL = "https://your-domain.com/tractap/";
window.TRACTAP_GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com";
```

Leave `TRACTAP_GOOGLE_CLIENT_ID` as the placeholder to keep the "Sign in with Google"
button hidden until you've set it up (see the backend README's Google Sign-In section).

## 2. Run it locally

Any static file server works — you can't just double-click `index.html` because the
browser will block `fetch` from a `file://` origin. Easiest:

```bash
npx serve .
# or
python3 -m http.server 5173
```

## 3. Deploy

Static site — upload `index.html`, `config.js`, `manifest.json`, `sw.js`, and `icons/`
to a folder cPanel serves directly, e.g. `public_html/tractap_public/`. No build step,
no CORS concerns if it's on the same domain as the backend.

## What's wired up

- Guest join → `GET /api/venues/:code`, live queue via `GET /api/venues/:code/requests`,
  refreshed by polling
- Song requests, voting → `POST` endpoints, with the device id persisted in
  `localStorage` (`tractap_device`) so a guest's vote/rate-limit state survives a
  refresh
- DJ signup/login (email + username + password) → JWT stored in `localStorage`
  (`tractap_token`); dashboard restores the DJ's active venue automatically on login
- **Sign in with Google** — renders automatically once `TRACTAP_GOOGLE_CLIENT_ID` is
  set; same login/signup outcome as the email flow, accounts auto-link by email
- **Forgot password** — link on the login screen → email → backend sends a reset link
  → `?reset=TOKEN` in the URL triggers the in-app "set new password" screen
- **Profile picture** — upload in the DJ Profile tab; shown next to the venue name on
  the guest-facing join/queue page
- Venue creation, QR code (generated client-side against the share link), analytics,
  and CSV export all call their matching backend routes directly

## Installing as an app / building an APK

This is a PWA (`manifest.json` + `sw.js` + `icons/`), which both "Add to Home Screen"
and a real Android APK build on top of.

**PWABuilder (no local tooling)** — deploy with HTTPS, paste the live URL into
pwabuilder.com, download the generated Android package.

**Bubblewrap / Trusted Web Activity** (for a real Play Store listing):
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://your-domain.com/tractap_public/manifest.json
bubblewrap build
```

## Known gaps to close before a real launch

- No payment/upgrade flow from `trial` → `pro` plan — the backend has the `plan`
  column ready, but there's no billing integration (Stripe, etc.) wired to flip it.
- Spotify/Apple Music fields are plain links, not live catalog search — that needs
  OAuth app registrations with each platform.
- Password-reset emails depend on the host's `mail()` working reliably — see the
  backend README's caveats on that.
