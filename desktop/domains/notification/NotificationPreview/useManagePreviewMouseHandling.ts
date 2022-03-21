import { requestSetPreviewOnTopState } from "@aca/desktop/bridge/preview";
import { createCleanupObject } from "@aca/shared/cleanup";
import { createDocumentEvent, createWindowEvent } from "@aca/shared/domEvents";

import { createLazyChangeCallback } from "./utils";

export function handlePreviewMouseManagement(url: string, previewElement: HTMLDivElement) {
  const handleIsInsidePreviewChange = createLazyChangeCallback((isInsidePreview: boolean) => {
    if (isInsidePreview) {
      requestSetPreviewOnTopState({ url, state: "preview-on-top" });
    } else {
      requestSetPreviewOnTopState({ url, state: "app-on-top" });
    }
  });

  const cleanup = createCleanupObject();

  function handleMouseEvent(event: MouseEvent, forceUpdate = true) {
    const target = event.target as HTMLElement;

    if (!target) return;

    const isInsidePreview = target === previewElement || previewElement.contains(target);

    handleIsInsidePreviewChange(isInsidePreview, forceUpdate);
  }

  cleanup.next = createWindowEvent(
    "focus",
    () => {
      handleIsInsidePreviewChange(false, true);
    },
    { capture: true }
  );

  cleanup.next = createWindowEvent("blur", () => {
    handleIsInsidePreviewChange(false, true);
  });

  cleanup.next = createDocumentEvent("mouseenter", handleMouseEvent, { capture: true });
  cleanup.next = createDocumentEvent("click", handleMouseEvent);
  cleanup.next = createDocumentEvent("mousemove", (event) => handleMouseEvent(event, false), { capture: true });

  return cleanup.clean;
}
