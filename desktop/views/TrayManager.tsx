import { observer } from "mobx-react";

import { useAutorun } from "@aca/shared/sharedState";

import { ApplicationTrayList, applicationTrayStateBridge } from "../bridge/tray";
import { getBadgeCountToShow } from "../domains/badge/count";
import { getInboxLists } from "../domains/list/all";

export const TrayManager = observer(() => {
  useAutorun(() => {
    const inboxLists = getInboxLists();

    const trayLists = inboxLists.map((list): ApplicationTrayList => {
      const count = list.getCountIndicator();

      return {
        id: list.id,
        count,
        name: list.name,
        group: list.listEntity ? "custom" : "built-in",
      };
    });

    const badgeCount = getBadgeCountToShow();

    applicationTrayStateBridge.update({ lists: trayLists, shouldShowIndicator: badgeCount === "•" || badgeCount > 0 });
  });

  return null;
});
