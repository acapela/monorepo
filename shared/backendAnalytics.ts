import { User } from "~db";
import Analytics from "analytics-node";
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

function createAnalyticsSessionForUser(user: User) {
  if (!process.env.NEXT_PUBLIC_SEGMENT_API_KEY) {
    return null;
  }

  const analytics = new Analytics(process.env.NEXT_PUBLIC_SEGMENT_API_KEY);

  analytics.identify({ userId: user.id, traits: getAnalyticsProfileFromDbUser(user) });

  if (user.current_team_id) {
    analytics.group({ userId: user.id, groupId: user.current_team_id });
  }

  return analytics;
}

export function backendTrackUserEvent<N extends keyof AnalyticsEventsMap>(
  user: User,
  eventName: N,
  payload?: AnalyticsEventsMap[N]
) {
  const analytics = createAnalyticsSessionForUser(user);

  if (!analytics) return;

  analytics.track({ userId: user.id, event: eventName, properties: payload });
}
