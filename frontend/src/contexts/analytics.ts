import { createContext, useContext } from "react";
import { SegmentAnalytics } from "@segment/analytics.js-core";
import { assert } from "~shared/assert";

type UserProfile = {
  name: string;
  email: string;
  avatarUrl?: string;
};

const AnalyticsReactContext = createContext<SegmentAnalytics.AnalyticsJS | null>(null);

export const AnalyticsContext = AnalyticsReactContext.Provider;

export function useAnalyticsContext() {
  const analyticsContext = useContext(AnalyticsReactContext);

  assert(analyticsContext, "useAnalyticsContext can only be called inside analyticsContext");

  return analyticsContext;
}
export function identifyUser(userId: string, userProfile: UserProfile) {
  const analytics = useAnalyticsContext();
  analytics.identify(userId, userProfile);
}
