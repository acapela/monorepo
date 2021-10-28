import snippet from "@segment/snippet";
import Script from "next/script";
import { memo } from "react";

import { useConst } from "~shared/hooks/useConst";

const segmentOptions = {
  // note: the page option only covers SSR tracking.
  // Page.js is used to track other events using `window.analytics.page()`
  page: true,
};

const SegmentScriptWithSnippet = ({ segmentApiKey }: { segmentApiKey: string }) => {
  const snippetHTML = useConst(() =>
    snippet.min({
      apiKey: segmentApiKey,
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

export const SegmentScript = memo(({ segmentApiKey }: { segmentApiKey: string | undefined }) => {
  if (!segmentApiKey) {
    return null;
  }

  return <SegmentScriptWithSnippet segmentApiKey={segmentApiKey} />;
});
