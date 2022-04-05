import { differenceInMilliseconds, differenceInMinutes } from "date-fns";

import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";

interface UrlLoadState {
  url: string;
  loadRequested: Date;
  htmlPageLoad?: Date;
  fullPageLoad?: Date;
  browserViewAttached?: Date;
  browserViewDisposed?: Date;
}

const allStates: Record<UrlLoadState["url"], UrlLoadState> = {};

const log = makeLogger("BrowserViewLoadState");

const FIVE_MINUTES = 5 * 60 * 1000;

setInterval(() => {
  for (const url of Object.keys(allStates)) {
    const loadRequested = allStates[url].loadRequested;
    const wasLoadRequestedOverFiveMinutesAgo = Math.abs(differenceInMinutes(new Date(), loadRequested)) > 5;
    if (wasLoadRequestedOverFiveMinutesAgo) {
      delete allStates[url];
    }
  }
}, FIVE_MINUTES);

export function markLoadRequestedTime(url: string) {
  allStates[url] = { url, loadRequested: new Date() };
}

export function markHtmlPageLoadTime(url: string) {
  const urlLoadState = allStates[url];

  if (!urlLoadState) {
    log.error(`url ${url} attempted to handle html page load before load requested`);
    return;
  }

  urlLoadState.loadRequested = new Date();
}

export function markFullPageLoadTime(url: string) {
  const urlLoadState = allStates[url];

  if (!urlLoadState) {
    log.error(`url ${url} attempted to handle html page load before load requested`);
    return;
  }

  urlLoadState.fullPageLoad = new Date();

  if (urlLoadState.browserViewAttached) {
    log.info("Loaded after BrowserView Attached", { ...urlLoadState, ...instrumentationResult(urlLoadState) });
    return;
  }
}

export function markViewAttachedTime(url: string) {
  const urlLoadState = allStates[url];

  if (!urlLoadState) {
    log.error(`url ${url} attempted to handle html page load before load requested`);
    return;
  }

  urlLoadState.browserViewAttached = new Date();
  if (urlLoadState.fullPageLoad) {
    log.debug("BrowserView Attached after loaded", { ...urlLoadState, ...instrumentationResult(urlLoadState) });
  }
}

export function markViewDisposedTime(url: string) {
  const urlLoadState = allStates[url];

  if (!urlLoadState) {
    log.error(`url ${url} attempted to handle html page load before load requested`);
    return;
  }

  urlLoadState.browserViewDisposed = new Date();

  if (!urlLoadState.browserViewAttached) {
    log.debug("BrowserView never used", { ...urlLoadState, ...instrumentationResult(urlLoadState) });
  }
}

function instrumentationResult({
  loadRequested,
  fullPageLoad,
  browserViewAttached,
  browserViewDisposed,
}: UrlLoadState) {
  if (fullPageLoad && browserViewAttached) {
    const wasFullyLoadedBeforePreview = fullPageLoad.getTime() < browserViewAttached.getTime();
    const deltaBetweenFullyLoadedAndAttached = Math.abs(fullPageLoad.getTime() - browserViewAttached.getTime());
    return {
      fullLoadTimeInMs: Math.abs(differenceInMilliseconds(loadRequested, fullPageLoad)),
      wasFullyLoadedBeforePreview,
      userLoadWaitTimeInMs: wasFullyLoadedBeforePreview ? 0 : deltaBetweenFullyLoadedAndAttached,
      timeBetweenFullyLoadedAndPreviewAttached: wasFullyLoadedBeforePreview ? deltaBetweenFullyLoadedAndAttached : 0,
    };
  }

  if (fullPageLoad && browserViewDisposed) {
    const wasFullyLoadedBeforeDisposed = fullPageLoad.getTime() < browserViewDisposed.getTime();
    return {
      fullLoadTimeInMs: Math.abs(differenceInMilliseconds(loadRequested, fullPageLoad)),
      wasFullyLoadedBeforeDisposed,
      timeBetweenFullyLoadedAndDisposed: !wasFullyLoadedBeforeDisposed
        ? fullPageLoad.getTime() - browserViewDisposed.getTime()
        : 0,
    };
  }

  if (!fullPageLoad && browserViewDisposed) {
    return {
      timeBetweenRequestedAndDisposed: browserViewDisposed.getTime() - loadRequested.getTime(),
    };
  }

  return {};
}
