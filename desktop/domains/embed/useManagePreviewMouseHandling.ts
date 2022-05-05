import { requestPreviewFocus, requestSetPreviewOnTopState } from "@aca/desktop/bridge/preview";
import { focusMainViewRequest } from "@aca/desktop/bridge/system";
import { createLazyChangeCallback } from "@aca/shared/callbacks/lazyChangeCallback";
import { createDocumentEvent } from "@aca/shared/domEvents";

export function handlePreviewMouseManagement(url: string, previewElement: HTMLElement) {
  const handleIsInsidePreviewChange = createLazyChangeCallback((shouldShowPreviewOnTop: boolean) => {
    if (shouldShowPreviewOnTop) {
      requestPreviewFocus({ url });
      requestSetPreviewOnTopState({ url, state: "preview-on-top" });
    } else {
      focusMainViewRequest();
      requestSetPreviewOnTopState({ url, state: "app-on-top" });
    }
  });

  return createDocumentEvent("mousemove", (e) => {
    const target = e.target as HTMLElement;

    const isEventInsidePreview = target === previewElement || previewElement.contains(target);

    handleIsInsidePreviewChange(isEventInsidePreview);
  });
}
