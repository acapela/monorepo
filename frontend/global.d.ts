import { SegmentAnalytics } from "@segment/analytics.js-core";

declare global {
  interface MediaDevices {
    getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  }

  interface Window {
    Userback: {
      access_token: string;
    };
    analytics: SegmentAnalytics.AnalyticsJS;
  }

  namespace jest {
    interface Matchers<R> {
      toBeRecent(): R;
    }
  }
}

// Ensure this is treated as a module.
export {};
