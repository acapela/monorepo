import snippet from "@segment/snippet";
import { assertGet } from "~shared/assert";

const segmentApiKey = assertGet(
  process.env.NEXT_PUBLIC_SEGMENT_API_KEY,
  "NEXT_PUBLIC_SEGMENT_API_KEY env variable is required"
);
const segmentOptions = {
  apiKey: segmentApiKey,
  // note: the page option only covers SSR tracking.
  // Page.js is used to track other events using `window.analytics.page()`
  page: true,
};

export default function segmentSnippet() {
  return snippet.min(segmentOptions);
}
