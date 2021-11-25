import { useEffect } from "react";

import { trackEvent } from "~frontend/src/analytics/tracking";
import { IS_DEV } from "~shared/dev";
import { roundNumber } from "~shared/numbers";

let didReport = false;

export function useReportPageReady(teamId?: string, condition?: boolean) {
  useEffect(() => {
    if (!teamId || !condition || didReport) return;

    didReport = true;

    const loadingTimeSeconds = performance.now() / 1000;

    const loadingTime = roundNumber(loadingTimeSeconds, 3);

    IS_DEV && console.info(`Load time - ${loadingTime}`);

    trackEvent("Opened App", { currentTeamId: teamId, loadingTime: loadingTime });
  }, [condition, teamId]);
}
