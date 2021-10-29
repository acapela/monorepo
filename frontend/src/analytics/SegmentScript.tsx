import snippet from "@segment/snippet";
import Script from "next/script";
import { memo } from "react";

import { useConst } from "~shared/hooks/useConst";

const segmentOptions = {
  // note: the page option only covers SSR tracking.
  // Page.js is used to track other events using `window.analytics.page()`
  page: true,
};

const SegmentScriptWithSnippet = ({ segmentAPIKey }: { segmentAPIKey: string }) => {
  const snippetHTML = useConst(() =>
    snippet.min({
      apiKey: segmentAPIKey,
      ...segmentOptions,
    })
  );

  const dangerouslySetInnerHTML = useConst(() => {
    return {
      __html: snippetHTML,
    };
  });

  return <Script id="segment-script" dangerouslySetInnerHTML={dangerouslySetInnerHTML} />;
};

export const SegmentScript = memo(({ segmentAPIKey }: { segmentAPIKey: string | undefined }) => {
  if (!segmentAPIKey) {
    return null;
  }

  return <SegmentScriptWithSnippet segmentAPIKey={segmentAPIKey} />;
});
