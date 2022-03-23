import { PreviewLoadingPriority, PreviewPosition } from "@aca/desktop/domains/preview";

import { createChannelBridge } from "./base/channels";
import { createInvokeBridge } from "./base/invoke";
import { createInvokeWithCleanupBridge } from "./base/invokeWithCleanup";

type PreviewGenericData = { url: string };

export const requestPreviewPreload = createInvokeWithCleanupBridge<
  PreviewGenericData & { priority: PreviewLoadingPriority }
>("preload-preview");

export const requestAttachPreview = createInvokeWithCleanupBridge<PreviewGenericData & { position: PreviewPosition }>(
  "attach-preview"
);

export const requestPreviewFocus = createInvokeWithCleanupBridge<PreviewGenericData>("preview-focus");

interface RequestSetPreviewOnTopState {
  url: string;
  state: "preview-on-top" | "app-on-top";
}

export const requestSetPreviewOnTopState =
  createInvokeBridge<RequestSetPreviewOnTopState>("requestSetPreviewOnTopState");

export const requestForceReloadPreview = createInvokeBridge<PreviewGenericData>("requestForceReloadPreview");

export const updatePreviewPosition =
  createInvokeWithCleanupBridge<{ url: string; position: PreviewPosition }>("update-preview-position");

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
