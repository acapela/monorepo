import { Analytics, AnalyticsBrowser } from "@segment/analytics-next";
import { memoize } from "lodash";
import { autorun } from "mobx";

import {
  asanaAuthTokenBridgeValue,
  clickupAuthTokenBridgeValue,
  figmaAuthTokenBridgeValue,
  githubAuthTokenBridgeValue,
  jiraAuthTokenBridgeValue,
  linearAuthTokenBridgeValue,
  notionAuthTokenBridgeValue,
} from "@aca/desktop/bridge/auth";
import { applicationFocusStateBridge } from "@aca/desktop/bridge/system";
import { uiSettingsBridge } from "@aca/desktop/bridge/ui";
import { getNullableDb } from "@aca/desktop/clientdb";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { SEGMENT_API_KEY } from "@aca/desktop/lib/env";
import { desktopRouter } from "@aca/desktop/routes";
import { accountStore } from "@aca/desktop/store/account";
import { createCleanupObject } from "@aca/shared/cleanup";
import { nullableDate } from "@aca/shared/dates/utils";
import { onDocumentReady } from "@aca/shared/document";
import { MINUTE } from "@aca/shared/time";
import { VoidableArgument } from "@aca/shared/types";
import {
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsEventPayload,
  AnalyticsUserProfile,
  PlanType,
} from "@aca/shared/types/analytics";

export function getUserAnalyticsProfile(): Partial<AnalyticsUserProfile> | null {
  const user = accountStore.user;

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: new Date(user.created_at), // will convert string into Date type if necessary,
    avatar: user.avatar_url,
    color_mode: uiSettingsBridge.get().theme,
    subscription_plan: user.subscription_plan as PlanType,

    figma_installed_at: (!!figmaAuthTokenBridgeValue.get() && figmaAuthTokenBridgeValue.lastUpdateDate) || undefined,
    notion_installed_at: (!!notionAuthTokenBridgeValue.get() && notionAuthTokenBridgeValue.lastUpdateDate) || undefined,
    linear_installed_at: (!!linearAuthTokenBridgeValue.get() && linearAuthTokenBridgeValue.lastUpdateDate) || undefined,
    jira_installed_at: (!!jiraAuthTokenBridgeValue.get() && jiraAuthTokenBridgeValue.lastUpdateDate) || undefined,
    slack_installed_at: nullableDate(accountStore.user?.slackInstallation?.updated_at) ?? undefined,
    github_installed_at: (githubAuthTokenBridgeValue.get() && githubAuthTokenBridgeValue.lastUpdateDate) || undefined,
    gmail_installed_at: nullableDate(getNullableDb()?.gmailAccount.all[0]?.created_at) ?? undefined,
    asana_installed_at: (asanaAuthTokenBridgeValue.get() && asanaAuthTokenBridgeValue.lastUpdateDate) || undefined,
    clickup_installed_at:
      (clickupAuthTokenBridgeValue.get() && clickupAuthTokenBridgeValue.lastUpdateDate) || undefined,
  };
}

const log = makeLogger("Analytics");

const getAnalytics = memoize(async () => {
  try {
    if (!SEGMENT_API_KEY) {
      log("No segment key - skip analytics init");
      return null;
    }
    const [analytics] = await AnalyticsBrowser.load({ writeKey: SEGMENT_API_KEY });

    log("analytics ready");

    return analytics;
  } catch (error) {
    log.error("Failed to initialize analytics", error);
    return null;
  }
});

onDocumentReady(async () => {
  try {
    const analytics = await getAnalytics();

    if (!analytics) {
      log(`Skipping analytics profile - analytics not initialized`);
      return;
    }

    initializeAnalytics(analytics);
  } catch (error) {
    log.error(error, "Failed to initialize analytics");
  }
});

/**
 * Time for app being inactive to consider 'App Opened' when being activated again.
 *
 * eg. if user is rapidly switching between Acapela and other apps, we should not consider each 'focus' event as App Opened
 */
const TIME_BLURRED_TO_CONSIDER_APP_OPENED = MINUTE * 3;

function initializeAnalytics(analytics: Analytics) {
  const cleanup = createCleanupObject();

  log("initializing automatic events and profile watching");

  cleanup.next = autorun(() => {
    const { lastAppFocusDateTs, lastAppBlurredDateTs } = applicationFocusStateBridge.get();

    const timeSinceLastActive = lastAppFocusDateTs - lastAppBlurredDateTs;

    // User is probably quickly switching between Acapela and other apps - don't consider this 'app opened'
    if (timeSinceLastActive < TIME_BLURRED_TO_CONSIDER_APP_OPENED) {
      return;
    }

    if (lastAppFocusDateTs > lastAppBlurredDateTs) {
      analytics.track("App Opened", { app_version: window.electronBridge.env.version });
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
    const { search, url } = desktopRouter.location;

    log("updating page", url);

    // Url makes no point in our context, it'd be something like file://foo/bar
    analytics.page({ path: url, url: url, search });
  }

  cleanup.next = autorun(updatePage);

  return cleanup.clean;
}

export async function trackEvent<N extends AnalyticsEventName>(
  type: N,
  ...[payload]: VoidableArgument<AnalyticsEventPayload<N>>
) {
  log("sending event", type, payload);
  try {
    const analytics = await getAnalytics();
    await analytics?.track(type, payload ?? undefined);
  } catch (error) {
    log.error(`Failed to trackEvent`, type, payload, error);
  }
}

export function createAnalyticsEvent<N extends AnalyticsEventName>(
  name: N,
  ...[payload]: VoidableArgument<AnalyticsEventPayload<N>>
): AnalyticsEvent<N> {
  return { type: name, payload: payload as AnalyticsEventPayload<N> };
}
