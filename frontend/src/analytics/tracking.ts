import { UserFragment } from "~gql";
import { AnalyticsEventsMap } from "~shared/types/analytics";

/**
 * trackEvent is used for all tracking calls which cannot be implemented on the backend side
 * the function proxies the tracking calls using a backend service to avoid ad blockers
 * @param eventName tracking event name
 * @param eventProperties traits to be passed along with the tracking call
 * @param user optional user parameter which will trigger an identify() call if defined
 */

export function trackEvent<N extends keyof AnalyticsEventsMap>(
  eventName: N,
  eventProperties?: AnalyticsEventsMap[N],
  user?: UserFragment
) {
  fetch("/api/backend/v1/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      payload: eventProperties,
      user,
    }),
  });
}
