export default function initializeUserbackPlugin(userbackAccessToken: string | undefined): void {
  // In dev we don't use it, so let's allow ignoring it.
  if (!userbackAccessToken) return;

  window.Userback = window.Userback || {};
  window.Userback.access_token = userbackAccessToken;
  (function (d) {
    const s = d.createElement("script");
    s.async = true;
    s.src = "https://static.userback.io/widget/v1.js";
    (d.head || d.body).appendChild(s);
  })(document);
}
