import Analytics from "analytics-node";

import { User } from "~db";

import { AnalyticsEventsMap, AnalyticsGroupsMap, AnalyticsUserProfile } from "./types/analytics";

function getAnalyticsProfileFromDbUser(user: User): AnalyticsUserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.created_at,
    avatar: user.avatar_url,
  };
}

function getAnalyticsSDK() {
  if (!process.env.SEGMENT_API_KEY) {
    return null;
  }

  return new Analytics(process.env.SEGMENT_API_KEY);
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

export const backendUserEventToJSON = <N extends keyof AnalyticsEventsMap>(
  userId: string,
  eventName: N,
  payload?: AnalyticsEventsMap[N]
) => JSON.stringify([userId, eventName, payload]);

export function identifyBackendUserTeam<N extends keyof AnalyticsGroupsMap>(
  userId: string,
  groupId: string,
  groupProperties?: AnalyticsGroupsMap[N]
) {
  const analytics = getAnalyticsSDK();
  if (analytics) {
    analytics.group({ userId, groupId, traits: groupProperties });
  }
}
