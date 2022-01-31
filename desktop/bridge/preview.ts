import { PreviewPosition } from "@aca/desktop/domains/preview";

import { createChannelBridge } from "./base/channels";
import { createInvokeWithCleanupBridge } from "./base/invokeWithCleanup";

type PreviewGenericData = { url: string };

export const requestPreviewPreload = createInvokeWithCleanupBridge<PreviewGenericData>("preload-preview");

export const requestAttachPreview = createInvokeWithCleanupBridge<PreviewGenericData & { position: PreviewPosition }>(
  "attach-preview"
);

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
    };

type PreviewEvent = PreviewEventBase & PreviewEventData;

export const previewEventsBridge = createChannelBridge<PreviewEvent>("preview-event");
