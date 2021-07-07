import { assertGet } from "../../shared/assert";

const userbackAccessToken = assertGet(
  process.env.NEXT_PUBLIC_USERBACK_ACCESS_TOKEN,
  "NEXT_PUBLIC_USERBACK_ACCESS_TOKEN env variable is required"
);

export default function initializeUserbackPlugin(): void {
  window.Userback = window.Userback || {};
  window.Userback.access_token = userbackAccessToken;
  (function (d) {
    const s = d.createElement("script");
    s.async = true;
    s.src = "https://static.userback.io/widget/v1.js";
    (d.head || d.body).appendChild(s);
  })(document);
}
