import { SegmentAnalytics } from "@segment/analytics.js-core";

declare global {
  interface Window {
    Userback: {
      access_token: string;
    };
    analytics: SegmentAnalytics.AnalyticsJS;
  }
}

// Ensure this is treated as a module.
export {};
