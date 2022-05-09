export interface PreloadURLLoadState {
  url: string;
  loadRequested: Date;
  htmlPageLoad?: Date;
  fullPageLoad?: Date;
  browserViewAttached?: Date;
  browserViewDisposed?: Date;
}

export interface PreloadInstrumentationReportResult {
  fullLoadTimeInMs: number;
  wasFullyLoadedBeforePreview: boolean;
  userLoadWaitTimeInMs: number;
  timeBetweenFullyLoadedAndPreviewAttachedInMs: number;
  wasFullyLoadedBeforeDisposed: boolean;
  timeBetweenFullyLoadedAndDisposedInMs: number;
  timeBetweenRequestedAndDisposedInMs: number;
}
