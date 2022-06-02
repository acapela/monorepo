import { observer } from "mobx-react";

import { setBadgeCountRequest } from "@aca/desktop/bridge/system";
import { useAutorun } from "@aca/shared/sharedState";

import { getBadgeCountToShow } from "../domains/badge/count";

export const BadgeCountManager = observer(() => {
  useAutorun(() => {
    const countOrIndicator = getBadgeCountToShow();

    setBadgeCountRequest(countOrIndicator);
  });

  return null;
});
