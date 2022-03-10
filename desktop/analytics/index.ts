import { autorun } from "mobx";

import {
  figmaAuthTokenBridgeValue,
  jiraAuthTokenBridgeValue,
  linearAuthTokenBridgeValue,
  notionAuthTokenBridgeValue,
} from "@aca/desktop/bridge/auth";
import { desktopRouter } from "@aca/desktop/routes";
import { accountStore } from "@aca/desktop/store/account";
import { assert } from "@aca/shared/assert";
import { createCleanupObject } from "@aca/shared/cleanup";
import { nullableDate } from "@aca/shared/dates/utils";
import { onDocumentReady } from "@aca/shared/document";
import { VoidableArgument } from "@aca/shared/types";
import {
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsEventPayload,
  AnalyticsUserProfile,
} from "@aca/shared/types/analytics";

import { applicationFocusStateBridge } from "../bridge/system";
import { makeLogger } from "../domains/dev/makeLogger";

const log = makeLogger("Analytics");

log.info("FOOOO");

export function getUserAnalyticsProfile(): AnalyticsUserProfile | null {
  const user = accountStore.user;

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: new Date(user.created_at), // will convert string into Date type if necessary,
    avatar: user.avatar_url,

    figma_installed_at: (!!figmaAuthTokenBridgeValue.get() && figmaAuthTokenBridgeValue.lastUpdateDate) || undefined,
    notion_installed_at: (!!notionAuthTokenBridgeValue.get() && notionAuthTokenBridgeValue.lastUpdateDate) || undefined,
    linear_installed_at: (!!linearAuthTokenBridgeValue.get() && linearAuthTokenBridgeValue.lastUpdateDate) || undefined,
    jira_installed_at: (!!jiraAuthTokenBridgeValue.get() && jiraAuthTokenBridgeValue.lastUpdateDate) || undefined,
    slack_installed_at: nullableDate(accountStore.user?.slackInstallation?.updated_at) ?? undefined,
  };
}

let isInitialized = false;

export function trackEvent<N extends AnalyticsEventName>(
  type: N,
  ...[payload]: VoidableArgument<AnalyticsEventPayload<N>>
) {
  assert(isInitialized, "Not initialized analytics");

  log("sending event", type, payload);
  analytics.track(type, payload ?? undefined);
}

/**
 * Type safe version of creating tracking event. I tried to avoid it, but did not find
 * a way to properly do
 *
 * const foo: TrackingEvent = {type: "foo", payload: {foo: "bar"}}
 *
 * where without using generic we have type-safe connection between type and payload.
 */
export function trackingEvent<N extends AnalyticsEventName>(
  name: N,
  ...[payload]: VoidableArgument<AnalyticsEventPayload<N>>
): AnalyticsEvent<N> {
  return { type: name, payload: payload as AnalyticsEventPayload<N> };
}

function initializeAnalytics() {
  const cleanup = createCleanupObject();
  cleanup.next = autorun(() => {
    const { lastAppFocusDateTs, lastAppBlurredDateTs } = applicationFocusStateBridge.get();
    if (lastAppFocusDateTs > lastAppBlurredDateTs) {
      trackEvent("App Opened");
    }
  });
  // Keep identity updated all the time
  cleanup.next = autorun(() => {
    const profile = getUserAnalyticsProfile();

    if (!profile) {
      return;
    }

    log("updating profile", { profile });

    // ?
    analytics.identify(profile.id, profile);
  });

  /**
   * Navigation by default is weird in electron as it is nor app nor website (eg. url tracking makes no point as files are local)
   *
   * It can be solved with Segment middleware like here: https://www.nedrockson.com/posts/electron/segment-analytics-work/
   *
   * But we can simply track our router we have and manually tell Segment what page we're in.
   */
  function updatePage() {
    const { search, url } = desktopRouter.getLocation();

    log("updating page", url);

    // Url makes no point in our context, it'd be something like file://foo/bar
    analytics.page({ path: url, url: url, search });
  }

  // Update page initially
  updatePage();

  cleanup.next = desktopRouter.subscribe(updatePage);

  isInitialized = true;

  return cleanup.clean;
}

onDocumentReady(() => {
  initializeAnalytics();
});
