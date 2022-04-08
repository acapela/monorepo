import { differenceInMilliseconds } from "date-fns";
import { BrowserView } from "electron";

import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";

interface URLLoadState {
  url: string;
  loadRequested: Date;
  htmlPageLoad?: Date;
  fullPageLoad?: Date;
  browserViewAttached?: Date;
  browserViewDisposed?: Date;
}

const allStates: WeakMap<BrowserView, URLLoadState> = new WeakMap();

const log = makeLogger("BrowserViewLoadInstrumentation");

export function markLoadRequestedTime(browserView: BrowserView, url: string) {
  allStates.set(browserView, { url, loadRequested: new Date() });
}

export function markHtmlPageLoadTime(browserView: BrowserView) {
  const urlLoadState = allStates.get(browserView);

  if (!isUrlStatePreviouslyRequested(urlLoadState)) {
    return;
  }

  urlLoadState.htmlPageLoad = new Date();
}

export function markFullPageLoadTime(browserView: BrowserView) {
  const urlLoadState = allStates.get(browserView);

  if (!isUrlStatePreviouslyRequested(urlLoadState)) {
    return;
  }

  urlLoadState.fullPageLoad = new Date();

  if (urlLoadState.browserViewAttached) {
    log.info("Loaded after BrowserView Attached", { ...urlLoadState, ...instrumentAttachmentResult(urlLoadState) });
    return;
  }
}

export function markViewAttachedTime(browserView: BrowserView) {
  const urlLoadState = allStates.get(browserView);

  if (!isUrlStatePreviouslyRequested(urlLoadState)) {
    return;
  }

  urlLoadState.browserViewAttached = new Date();
  if (urlLoadState.fullPageLoad) {
    log.debug("BrowserView Attached after loaded", { ...urlLoadState, ...instrumentAttachmentResult(urlLoadState) });
  }
}

export function markViewDisposedTime(browserView: BrowserView) {
  const urlLoadState = allStates.get(browserView);

  if (!isUrlStatePreviouslyRequested(urlLoadState)) {
    return;
  }

  urlLoadState.browserViewDisposed = new Date();

  if (!urlLoadState.browserViewAttached) {
    log.debug("BrowserView never used", { ...urlLoadState, ...instrumentDisposalResult(urlLoadState) });
  }
}

function isUrlStatePreviouslyRequested(urlLoadState: URLLoadState | undefined): urlLoadState is URLLoadState {
  return !!urlLoadState && !!urlLoadState.loadRequested;
}

function instrumentAttachmentResult({ loadRequested, fullPageLoad, browserViewAttached }: URLLoadState) {
  if (fullPageLoad && browserViewAttached) {
    const wasFullyLoadedBeforePreview = fullPageLoad.getTime() < browserViewAttached.getTime();
    const deltaBetweenFullyLoadedAndAttached = Math.abs(fullPageLoad.getTime() - browserViewAttached.getTime());
    return {
      fullLoadTimeInMs: Math.abs(differenceInMilliseconds(loadRequested, fullPageLoad)),
      wasFullyLoadedBeforePreview,
      userLoadWaitTimeInMs: wasFullyLoadedBeforePreview ? 0 : deltaBetweenFullyLoadedAndAttached,
      timeBetweenFullyLoadedAndPreviewAttachedInMs: wasFullyLoadedBeforePreview
        ? deltaBetweenFullyLoadedAndAttached
        : 0,
    };
  }
  return {};
}

function instrumentDisposalResult({ loadRequested, fullPageLoad, browserViewDisposed }: URLLoadState) {
  if (fullPageLoad && browserViewDisposed) {
    const wasFullyLoadedBeforeDisposed = fullPageLoad.getTime() < browserViewDisposed.getTime();
    return {
      fullLoadTimeInMs: Math.abs(differenceInMilliseconds(loadRequested, fullPageLoad)),
      wasFullyLoadedBeforeDisposed,
      timeBetweenFullyLoadedAndDisposedInMs: wasFullyLoadedBeforeDisposed
        ? browserViewDisposed.getTime() - fullPageLoad.getTime()
        : 0,
    };
  }

  if (!fullPageLoad && browserViewDisposed) {
    return {
      timeBetweenRequestedAndDisposedInMs: browserViewDisposed.getTime() - loadRequested.getTime(),
    };
  }

  return {};
}
