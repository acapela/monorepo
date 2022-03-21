import { Analytics, AnalyticsBrowser } from "@segment/analytics-next";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";

import { SEGMENT_API_KEY } from "@aca/desktop/lib/env";
export const AnalyticsContext = React.createContext<Analytics | undefined>(undefined);

export const AnalyticsProvider = ({ children }: { children: any }) => {
  const [analytics, setAnalytics] = useState<Analytics | undefined>(undefined);

  useEffect(() => {
    const loadAnalytics = async () => {
      const [response] = await AnalyticsBrowser.load({ writeKey: SEGMENT_API_KEY });
      setAnalytics(response);
    };
    loadAnalytics();
  }, [SEGMENT_API_KEY]);

  return <AnalyticsContext.Provider value={analytics}>{children}</AnalyticsContext.Provider>;
};

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
