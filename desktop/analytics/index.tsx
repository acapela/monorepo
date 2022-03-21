import { Analytics, AnalyticsBrowser } from "@segment/analytics-next";
import { autorun } from "mobx";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";

import {
  figmaAuthTokenBridgeValue,
  jiraAuthTokenBridgeValue,
  linearAuthTokenBridgeValue,
  notionAuthTokenBridgeValue,
} from "@aca/desktop/bridge/auth";
import { applicationFocusStateBridge } from "@aca/desktop/bridge/system";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { SEGMENT_API_KEY } from "@aca/desktop/lib/env";
import { desktopRouter } from "@aca/desktop/routes";
import { accountStore } from "@aca/desktop/store/account";
import { createCleanupObject } from "@aca/shared/cleanup";
import { nullableDate } from "@aca/shared/dates/utils";
import { VoidableArgument } from "@aca/shared/types";
import {
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsEventPayload,
  AnalyticsUserProfile,
} from "@aca/shared/types/analytics";

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

export const AnalyticsContext = React.createContext<any | undefined>(undefined); // TODO(types): add type definition

export const AnalyticsProvider = ({ children }: { children: any }) => {
  const [analytics, setAnalytics] = useState<Analytics | undefined>(undefined);

  const log = makeLogger("Analytics");

  useEffect(() => {
    const loadAnalytics = async () => {
      const [response] = await AnalyticsBrowser.load({ writeKey: SEGMENT_API_KEY });
      setAnalytics(response);
      log("analytics ready");
    };
    loadAnalytics();
  }, []);

  useEffect(() => {
    if (analytics) {
      initializeAnalytics();
    }
  }, [analytics]);

  function track<N extends AnalyticsEventName>(type: N, ...[payload]: VoidableArgument<AnalyticsEventPayload<N>>) {
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
  function trackingEvent<N extends AnalyticsEventName>(
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
        track("App Opened", { app_version: window.electronBridge.env.version });
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

    return cleanup.clean;
  }

  const value = { track, trackingEvent };
  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
