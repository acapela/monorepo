import { AnalyticsUserProfile, AnalyticsGroupsMap, AnalyticsEventsMap } from "~shared/types/analytics";

export function identifyUser(userProfile: AnalyticsUserProfile) {
  if (window.analytics) {
    window.analytics.identify(userProfile.id, userProfile);
  }
}

export function trackEvent<N extends keyof AnalyticsEventsMap>(eventName: N, eventProperties?: AnalyticsEventsMap[N]) {
  if (window.analytics) {
    window.analytics.track(eventName, eventProperties);
  }
}

export function identifyUserGroup<N extends keyof AnalyticsGroupsMap>(
  groupName: N,
  groupProperties: AnalyticsGroupsMap[N]
) {
  if (window.analytics) {
    window.analytics.group(groupName, groupProperties);
  }
}
