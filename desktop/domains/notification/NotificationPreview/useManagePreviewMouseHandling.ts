import { requestSetPreviewOnTopState } from "@aca/desktop/bridge/preview";
import { createCleanupObject } from "@aca/shared/cleanup";
import { createDocumentEvent, createWindowEvent } from "@aca/shared/domEvents";

import { createLazyChangeCallback } from "./utils";

export function handlePreviewMouseManagement(url: string, previewElement: HTMLDivElement) {
  const handleIsInsidePreviewChange = createLazyChangeCallback((isInsidePreview: boolean) => {
    console.log({ isInsidePreview });
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

  createWindowEvent("blur", () => {
    console.log("blur");
  });

  createWindowEvent("focus", () => {
    console.log("focus");
  });

  cleanup.next = createDocumentEvent("mouseenter", handleMouseEvent);
  cleanup.next = createDocumentEvent("click", (event) => {
    const target = event.target as HTMLElement;

    const isInsidePreview = target === previewElement || previewElement.contains(target);

    console.log("CLICK", event.target, { isInsidePreview });
    window.focus();
    handleMouseEvent(event);
  });
  cleanup.next = createDocumentEvent("mousemove", (event) => handleMouseEvent(event, false), { capture: true });

  return cleanup.clean;
}
