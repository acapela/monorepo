import { observer } from "mobx-react";

import { useAutorun } from "@aca/shared/sharedState";

import { ApplicationTrayList, applicationTrayStateBridge } from "../bridge/tray";
import { getBadgeCountToShow } from "../domains/badge/count";
import { allNotificationsList, getInboxLists } from "../domains/list/all";
import { LIST_SYSTEM_IDS } from "../domains/list/system";

export const TrayManager = observer(() => {
  useAutorun(() => {
    const inboxLists = getInboxLists();

    const trayLists = inboxLists.map((list): ApplicationTrayList => {
      const count = list.getCountIndicator();

      function getGroupAndOrderInfo(): Partial<ApplicationTrayList> {
        if (list.listEntity?.system_id === LIST_SYSTEM_IDS.important) return { group: "summary", order: 1 };
        if (list === allNotificationsList) return { group: "summary", order: 2 };

        if (!list.listEntity) return { group: "built-in" };

        return { group: "custom" };
      }

      return {
        id: list.id,
        count,
        name: list.name,
        ...getGroupAndOrderInfo(),
      };
    });

    const badgeCount = getBadgeCountToShow();

    applicationTrayStateBridge.update({ lists: trayLists, shouldShowIndicator: badgeCount === "•" || badgeCount > 0 });
  });

  return null;
});
