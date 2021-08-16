import snippet from "@segment/snippet";
import Script from "next/script";
import { memo } from "react";
import { useConst } from "~shared/hooks/useConst";

const segmentApiKey = process.env.NEXT_PUBLIC_SEGMENT_API_KEY;

const segmentOptions = {
  apiKey: segmentApiKey,
  // note: the page option only covers SSR tracking.
  // Page.js is used to track other events using `window.analytics.page()`
  page: true,
};

function getSegmentOptions() {
  /**
   * We're cloning the object as under the hood sentry will extend this object every time snippet.min is called.
   *
   * After 10-20 rounds it quickly results with options.load having 20mb long string that is JSON.stringified
   */
  return { ...segmentOptions };
}

const SegmentScriptWithSnippet = () => {
  const snippetHTML = useConst(() => snippet.min(getSegmentOptions()));

  const dangerouslySetInnerHTML = useConst(() => {
    return {
      __html: snippetHTML,
    };
  });

  return <Script id="segment-script" dangerouslySetInnerHTML={dangerouslySetInnerHTML} />;
};

export const SegmentScript = memo(() => {
  if (!segmentOptions.apiKey) {
    return null;
  }

  return <SegmentScriptWithSnippet />;
});
