import { requestSetPreviewOnTopState } from "@aca/desktop/bridge/preview";
import { focusMainViewRequest } from "@aca/desktop/bridge/system";
import { createCleanupObject } from "@aca/shared/cleanup";
import { createDocumentEvent, createWindowEvent } from "@aca/shared/domEvents";

import { createLazyChangeCallback } from "./utils";

/**
 * This handles putting proper layer of the app on top.
 *
 * Note: this has a lot of edge cases
 *
 * TODO: Probably we need some more fundamental and declarative approach for focus management
 */

export function handlePreviewMouseManagement(url: string, previewElement: HTMLDivElement) {
  /**
   * Usually we only want to let electron know only when `shouldShowPreviewOnTop` changes (so we ignore 2 events that yields the same value)
   */
  const handleIsInsidePreviewChange = createLazyChangeCallback((shouldShowPreviewOnTop: boolean) => {
    if (shouldShowPreviewOnTop) {
      requestSetPreviewOnTopState({ url, state: "preview-on-top" });
    } else {
      requestSetPreviewOnTopState({ url, state: "app-on-top" });
    }
  });

  const cleanup = createCleanupObject();

  function handleMouseEvent(event: MouseEvent, forceUpdate = true) {
    const target = event.target as HTMLElement;

    if (!target) return;

    const isEventInsidePreview = target === previewElement || previewElement.contains(target);

    handleIsInsidePreviewChange(isEventInsidePreview, forceUpdate);
  }

  cleanup.next = createWindowEvent(
    "focus",
    () => {
      // When window is focused - always force update to show app on top
      handleIsInsidePreviewChange(false, true);
    },
    { capture: true }
  );

  /**
   * We constantly watch 'mouse-enter' on elements to know if mouse is over preview or not
   */
  cleanup.next = createDocumentEvent("mouseenter", handleMouseEvent);
  cleanup.next = createDocumentEvent("click", (event) => {
    const target = event.target as HTMLElement;

    const isInsidePreview = target === previewElement || previewElement.contains(target);

    /**
     * There is some really weird edge-case I dont understand. If focus is inside preview, even if clicks
     * are registered on 'app' - it is not focusing the app if we click anything from 'BodyPortal'.
     *
     * It works for everything else - thus even is registered, but preview is still focused - making 'CMD + Esc to return' label to stay.
     *
     * Thus we make sure to focus the app here
     */
    if (!isInsidePreview) {
      focusMainViewRequest();
    }
    handleMouseEvent(event);
  });

  /**
   * Sometimes top layer changes without mouse movement (eg. CMD + Esc). In such case we'll not get 'fresh' mouse-enter as
   * mouse is already inside some element. Thus let's also watch for mousemove.
   */
  cleanup.next = createDocumentEvent(
    "mousemove",
    (event) =>
      handleMouseEvent(
        event,
        // Make it lazy - meaning we only publish actual changes to avoid spamming electron all the time with the same value
        false
      ),
    { capture: true }
  );

  return cleanup.clean;
}
