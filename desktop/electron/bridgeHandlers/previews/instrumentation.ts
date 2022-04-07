import { differenceInMilliseconds, differenceInMinutes } from "date-fns";
import { keys } from "lodash";

import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";

interface URLLoadState {
  webContentsId: string;
  url: string;
  loadRequested: Date;
  htmlPageLoad?: Date;
  fullPageLoad?: Date;
  browserViewAttached?: Date;
  browserViewDisposed?: Date;
}

const allStates: Record<URLLoadState["webContentsId"], URLLoadState> = {};

const log = makeLogger("BrowserViewLoadState");

const FIVE_MINUTES = 5 * 60 * 1000;

/*
  We garbage collect every five minutes for url states that are older than 5 minutes
*/
setInterval(() => {
  for (const url of keys(allStates)) {
    const loadRequested = allStates[url].loadRequested;
    const wasLoadRequestedOverFiveMinutesAgo = Math.abs(differenceInMinutes(new Date(), loadRequested)) > 5;
    if (wasLoadRequestedOverFiveMinutesAgo) {
      delete allStates[url];
    }
  }
}, FIVE_MINUTES);

export function markLoadRequestedTime(webContentsId: string, url: string) {
  allStates[webContentsId] = { webContentsId, url, loadRequested: new Date() };
}

export function markHtmlPageLoadTime(webContentsId: string) {
  const urlLoadState = allStates[webContentsId];

  if (!isUrlStatePreviouslyRequested(urlLoadState)) {
    return;
  }

  urlLoadState.htmlPageLoad = new Date();
}

export function markFullPageLoadTime(webContentsId: string) {
  const urlLoadState = allStates[webContentsId];

  if (!isUrlStatePreviouslyRequested(urlLoadState)) {
    return;
  }

  urlLoadState.fullPageLoad = new Date();

  if (urlLoadState.browserViewAttached) {
    log.info("Loaded after BrowserView Attached", { ...urlLoadState, ...instrumentAttachmentResult(urlLoadState) });
    return;
  }
}

export function markViewAttachedTime(webContentsId: string) {
  const urlLoadState = allStates[webContentsId];

  if (!isUrlStatePreviouslyRequested(urlLoadState)) {
    return;
  }

  urlLoadState.browserViewAttached = new Date();
  if (urlLoadState.fullPageLoad) {
    log.debug("BrowserView Attached after loaded", { ...urlLoadState, ...instrumentAttachmentResult(urlLoadState) });
  }
}

export function markViewDisposedTime(webContentsId: string) {
  const urlLoadState = allStates[webContentsId];

  if (!isUrlStatePreviouslyRequested(urlLoadState)) {
    return;
  }

  urlLoadState.browserViewDisposed = new Date();

  if (!urlLoadState.browserViewAttached) {
    log.debug("BrowserView never used", { ...urlLoadState, ...instrumentDisposalResult(urlLoadState) });
  }
}

function isUrlStatePreviouslyRequested(urlLoadState: URLLoadState): boolean {
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
      timeBetweenFullyLoadedAndDisposedInMs: !wasFullyLoadedBeforeDisposed
        ? fullPageLoad.getTime() - browserViewDisposed.getTime()
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
