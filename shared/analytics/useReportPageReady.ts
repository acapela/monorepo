import { useEffect } from "react";

import { trackEvent } from "~frontend/src/analytics/tracking";
import { IS_DEV } from "~shared/dev";

let didReport = false;

export function useReportPageReady(teamId?: string, condition?: boolean) {
  useEffect(() => {
    if (!teamId || !condition || didReport) return;

    didReport = true;

    IS_DEV && console.info(`Load time - ${performance.now()}`);

    trackEvent("Opened App", { currentTeamId: teamId, loadingTime: performance.now() });
  }, [condition, teamId]);
}
