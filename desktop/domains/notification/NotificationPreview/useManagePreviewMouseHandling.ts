import { RefObject, useEffect } from "react";

import { requestSetPreviewOnTopState } from "@aca/desktop/bridge/preview";
import { createCleanupObject } from "@aca/shared/cleanup";
import { createDocumentEvent, createElementEvent } from "@aca/shared/domEvents";

export function useManagePreviewMouseHandling(url: string, previewRef: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const previewElement = previewRef.current!;

    if (!previewElement) return;

    function handleFocusOnPreview() {
      requestSetPreviewOnTopState({ url, state: "preview-on-top" });
    }

    function handleReleaseFocusOnPreview() {
      requestSetPreviewOnTopState({ url, state: "app-on-top" });
    }

    const cleanup = createCleanupObject();

    cleanup.next = createElementEvent(previewElement, "mouseenter", handleFocusOnPreview);

    cleanup.next = createDocumentEvent("mouseenter", handleReleaseFocusOnPreview, { capture: true });

    return cleanup.clean;
  }, []);
}
