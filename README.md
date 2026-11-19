# TRACTAP on GitHub Pages

This folder is a ready-to-publish static build of the TRACTAP frontend. It has
no Node.js build step and can be deployed directly by GitHub Pages.

The PHP API is configured separately for Render. The repository root contains
`render.yaml` and `api.eunic.co.za/Dockerfile` for deploying it as a Docker web
service.

## Publish

In the repository settings, open **Pages**, choose **Deploy from a branch**,
select the branch containing this folder, and choose `/docs` as the folder.
GitHub Pages will publish the app at a URL similar to:

```text
https://OWNER.github.io/REPOSITORY/
```

The app URL is detected automatically, including repository deployments that
live below the domain root.

## Backend requirement

The Pages build calls `https://tractap-api.onrender.com` by default. If Render
assigns a different URL, update `config.js`. The Render service must allow the
exact GitHub Pages origin through the `ALLOWED_ORIGIN` environment variable.

```php
ALLOWED_ORIGIN=https://OWNER.github.io
```

For a project site, the origin is still only `https://OWNER.github.io`; the
repository path is not part of the origin. If a custom domain is configured,
use that domain instead. Keep the API's production JWT secret and database
credentials out of this repository.

## Deploy the API to Render

1. Push this repository to GitHub.
2. In Render, choose **New → Blueprint** and select the repository.
3. Render will read `render.yaml` and build the PHP API from
   `api.eunic.co.za/Dockerfile`.
4. Add the MySQL connection values and a long random `JWT_SECRET` as prompted.
5. Set `APP_URL` to the published GitHub Pages URL and
   `BACKEND_PUBLIC_URL` to the Render service URL.
6. Confirm `https://YOUR-RENDER-URL/api/health` returns JSON with `ok: true`.

Render does not provide a built-in MySQL database for this service definition;
use an external MySQL-compatible database and copy its connection values into
the Render environment variables. Uploaded avatars on an ephemeral container
should also be moved to object storage before production use.

## Optional configuration

Edit `config.js` to set a Google OAuth client ID. The placeholder intentionally
keeps Google sign-in hidden until the OAuth client is configured for the Pages
origin.

The service worker and manifest use relative URLs, so PWA installation works
from both a repository site and a custom-domain site.
