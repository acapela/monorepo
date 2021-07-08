import snippet from "@segment/snippet";
import Script from "next/script";

const segmentApiKey = process.env.NEXT_PUBLIC_SEGMENT_API_KEY;

const segmentOptions = {
  apiKey: segmentApiKey,
  // note: the page option only covers SSR tracking.
  // Page.js is used to track other events using `window.analytics.page()`
  page: true,
};

export const SegmentScript = () => {
  if (!segmentOptions.apiKey) {
    return null;
  }

  return (
    <Script
      dangerouslySetInnerHTML={{
        __html: snippet.min(segmentOptions),
      }}
    />
  );
};
