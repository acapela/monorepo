import { createInvokeBridge } from "./base/channels";

interface RequestPreviewData {
  url: string;
}

export const requestPreloadInMainWindow = createInvokeBridge<Boolean, RequestPreviewData>("request-preload-in-main");
export const requestPreviewInMainWindow = createInvokeBridge<Boolean, RequestPreviewData>("request-preview-in-main");
