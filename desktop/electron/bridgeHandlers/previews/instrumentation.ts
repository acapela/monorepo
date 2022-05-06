import { differenceInMilliseconds } from "date-fns";
import { BrowserView } from "electron";

import { trackEvent } from "@aca/desktop/analytics";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import {
  PreloadInstrumentationReportResult,
  PreloadURLLoadState,
} from "@aca/shared/debug/electronInstrumentation.types";
import { AnalyticsEventName } from "@aca/shared/types/analytics";

const allStates: WeakMap<BrowserView, PreloadURLLoadState> = new WeakMap();

const log = makeLogger("BrowserViewLoadInstrumentation");

export function markLoadRequestedTime(browserView: BrowserView, url: string) {
  allStates.set(browserView, { url, loadRequested: new Date() });
}

function track(event: AnalyticsEventName, payload: PreloadURLLoadState & Partial<PreloadInstrumentationReportResult>) {
  trackEvent(event, payload);
  log.debug(event, payload);
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
    track("BrowserView Loaded after Attached", { ...urlLoadState, ...instrumentAttachmentResult(urlLoadState) });
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
    track("BrowserView Attached after Loaded", { ...urlLoadState, ...instrumentAttachmentResult(urlLoadState) });
  }
}

export function markViewDisposedTime(browserView: BrowserView) {
  const urlLoadState = allStates.get(browserView);

  if (!isUrlStatePreviouslyRequested(urlLoadState)) {
    return;
  }

  urlLoadState.browserViewDisposed = new Date();

  if (!urlLoadState.browserViewAttached) {
    track("BrowserView never used", { ...urlLoadState, ...instrumentDisposalResult(urlLoadState) });
  }
}

function isUrlStatePreviouslyRequested(
  urlLoadState: PreloadURLLoadState | undefined
): urlLoadState is PreloadURLLoadState {
  return !!urlLoadState && !!urlLoadState.loadRequested;
}

function instrumentAttachmentResult({
  loadRequested,
  fullPageLoad,
  browserViewAttached,
}: PreloadURLLoadState): Partial<PreloadInstrumentationReportResult> {
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

function instrumentDisposalResult({
  loadRequested,
  fullPageLoad,
  browserViewDisposed,
}: PreloadURLLoadState): Partial<PreloadInstrumentationReportResult> {
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
