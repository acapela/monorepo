import { createInvokeBridge } from "./base/channels";

interface RequestPreviewData {
  id: number;
}

export const requestPreviewInMainWindow = createInvokeBridge<Boolean, RequestPreviewData>("request-preview-in-main");
