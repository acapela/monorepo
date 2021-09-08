import Analytics from "analytics-node";

import { User } from "~db";

import { AnalyticsEventsMap, AnalyticsUserProfile } from "./types/analytics";

function getAnalyticsProfileFromDbUser(user: User): AnalyticsUserProfile {
  return {
    id: user.id,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    email: user.email!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    name: user.name!,
    avatarUrl: user.avatar_url ?? undefined,
  };
}

function getAnalyticsSDK() {
  if (!process.env.NEXT_PUBLIC_SEGMENT_API_KEY) {
    return null;
  }

  return new Analytics(process.env.NEXT_PUBLIC_SEGMENT_API_KEY);
}

function createAnalyticsSessionForUser(user: User) {
  const analytics = getAnalyticsSDK();

  if (analytics) {
    analytics.identify({
      userId: user.id,
      traits: getAnalyticsProfileFromDbUser(user),
    });
  }
}

export function trackFirstBackendUserEvent<N extends keyof AnalyticsEventsMap>(
  user: User,
  eventName: N,
  payload?: AnalyticsEventsMap[N]
) {
  createAnalyticsSessionForUser(user);

  trackBackendUserEvent(user.id, eventName, payload);
}

export function trackBackendUserEvent<N extends keyof AnalyticsEventsMap>(
  userId: string,
  eventName: N,
  payload?: AnalyticsEventsMap[N]
) {
  const analytics = getAnalyticsSDK();

  if (analytics) {
    analytics.track({ userId, event: eventName, properties: payload });
  }
}
