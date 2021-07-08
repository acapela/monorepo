const userbackAccessToken = process.env.NEXT_PUBLIC_USERBACK_ACCESS_TOKEN;

export default function initializeUserbackPlugin(): void {
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
