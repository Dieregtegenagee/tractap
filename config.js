/* GitHub Pages configuration.
 *
 * The frontend is served from a repository subpath (for example
 * https://OWNER.github.io/REPOSITORY/), so derive the app URL from the page
 * itself instead of hard-coding a domain or assuming the site is at /.
 * Update the API URL if the backend is moved.
 */
// Replace this with the Render URL generated for the `tractap-api` service if
// you choose a different service name.
window.TRACTAP_API_BASE = "https://tractap-api.onrender.com";
window.TRACTAP_APP_URL = new URL("./", document.baseURI).href;
window.TRACTAP_GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com";
