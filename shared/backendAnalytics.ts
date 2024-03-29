import Sentry from "@sentry/node";
import Analytics from "analytics-node";

import { User } from "@aca/db";

import { AnalyticsEventsMap, AnalyticsUserProfile } from "./types/analytics";

function getAnalyticsProfileFromDbUser(user: User): Partial<AnalyticsUserProfile> {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: new Date(user.created_at), // will convert string into Date type if necessary
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
    try {
      analytics.identify({
        userId: user.id,
        traits: getAnalyticsProfileFromDbUser(user),
      });
    } catch (error) {
      Sentry.captureException(error);
    }
  }
}

export function identifyBackendUser(userId: string, traits: Partial<AnalyticsUserProfile>) {
  const analytics = getAnalyticsSDK();

  if (analytics) {
    try {
      analytics.identify({
        userId,
        traits,
      });
    } catch (error) {
      Sentry.captureException(error);
    }
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
    try {
      analytics.track({ userId, event: eventName, properties: payload });
    } catch (error) {
      Sentry.captureException(error);
    }
  }
}

export const backendUserEventToJSON = <N extends keyof AnalyticsEventsMap>(
  userId: string,
  eventName: N,
  payload?: AnalyticsEventsMap[N]
) => JSON.stringify([userId, eventName, payload]);
