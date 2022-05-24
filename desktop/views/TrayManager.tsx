import { observer } from "mobx-react";

import { useAutorun } from "@aca/shared/sharedState";

import { ApplicationTrayList, applicationTrayStateBridge } from "../bridge/tray";
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

    applicationTrayStateBridge.update({ lists: trayLists });
  });

  return null;
});
