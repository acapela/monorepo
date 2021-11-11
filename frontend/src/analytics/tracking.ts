import { AnalyticsEventsMap } from "~shared/types/analytics";

export function trackEvent<N extends keyof AnalyticsEventsMap>(eventName: N, eventProperties?: AnalyticsEventsMap[N]) {
  fetch("/api/backend/v1/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventName,
      payload: eventProperties,
    }),
  });
}
