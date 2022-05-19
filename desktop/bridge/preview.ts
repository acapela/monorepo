import { createBridgeValue } from "@aca/desktop/bridge/base/persistance";
import { PreviewLoadingPriority, PreviewPosition } from "@aca/desktop/domains/embed";

import { createChannelBridge } from "./base/channels";
import { createInvokeBridge } from "./base/invoke";
import { createInvokeWithCleanupBridge } from "./base/invokeWithCleanup";

type PreviewGenericData = { url: string };

export const requestEmbedPreload = createInvokeWithCleanupBridge<
  PreviewGenericData & { priority: PreviewLoadingPriority }
>("preload-preview");

type PreviewPositionalData = PreviewGenericData & { position: PreviewPosition };

export const requestAttachPreview = createInvokeWithCleanupBridge<
  PreviewPositionalData & { skipPositionUpdate?: boolean }
>("attach-preview");

export const requestPreviewFocus = createInvokeWithCleanupBridge<PreviewGenericData>("preview-focus");

interface RequestSetPreviewOnTopState {
  url: string;
  state: "preview-on-top" | "app-on-top";
}

export const requestSetPreviewOnTopState =
  createInvokeBridge<RequestSetPreviewOnTopState>("requestSetPreviewOnTopState");

export const requestForceReloadPreview = createInvokeBridge<PreviewGenericData>("requestForceReloadPreview");

export const updatePreviewPosition = createInvokeWithCleanupBridge<PreviewPositionalData>("update-preview-position");

export const startPreviewAnimation = createInvokeBridge<{
  start: PreviewPositionalData;
  end: PreviewPositionalData;
  animation: "swipe-up" | "swipe-down";
}>("start-preview-animation");

interface PreviewEventBase {
  url: string;
}

type PreviewEventData =
  | {
      type: "focus";
    }
  | {
      type: "blur";
    }
  | { type: "load-error" }
  | { type: "snooze-request" }
  | { type: "resolve-request" }
  | { type: "open-in-app-request" };

type PreviewEvent = PreviewEventBase & PreviewEventData;

export const previewEventsBridge = createChannelBridge<PreviewEvent>("preview-event");

export const preloadingPreviewsBridgeChannel = createBridgeValue("preloadingPreviews", {
  getDefault() {
    return {} as Record<string, "loading" | "ready" | "error">;
  },
});
