import { PreviewPosition } from "@aca/desktop/domains/preview";

import { createInvokeWithCleanupBridge } from "./base/invokeWithCleanup";

type PreviewGenericData = { url: string };

export const requestPreviewPreload = createInvokeWithCleanupBridge<PreviewGenericData>("preload-preview");

export const requestAttachPreview = createInvokeWithCleanupBridge<PreviewGenericData & { position: PreviewPosition }>(
  "attach-preview"
);

export const updatePreviewPosition =
  createInvokeWithCleanupBridge<{ url: string; position: PreviewPosition }>("update-preview-position");
