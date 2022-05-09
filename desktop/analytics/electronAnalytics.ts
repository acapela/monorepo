import { AnalyticsNode } from "@segment/analytics-next";
import { memoize } from "lodash";

import { VoidableArgument } from "@aca/shared/types";
import { AnalyticsEvent, AnalyticsEventName, AnalyticsEventPayload } from "@aca/shared/types/analytics";

import { makeLogger } from "../domains/dev/makeLogger";
import { SEGMENT_API_KEY } from "../lib/env";

const log = makeLogger("Analytics");

const getAnalytics = memoize(async () => {
  try {
    if (!SEGMENT_API_KEY) {
      log.error("No segment key - skip analytics electron init");
      return null;
    }
    const [analytics] = await AnalyticsNode.load({ writeKey: SEGMENT_API_KEY });

    log.info("analytics ready");

    return analytics;
  } catch (error) {
    log.error("Failed to initialize analytics", error);
    return null;
  }
});

export async function trackEvent<N extends AnalyticsEventName>(
  type: N,
  ...[payload]: VoidableArgument<AnalyticsEventPayload<N>>
) {
  log.info("sending event", type, payload);
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
