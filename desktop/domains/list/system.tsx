import { autorun, runInAction } from "mobx";
import React, { ReactNode } from "react";

import { getNullableDb } from "@aca/desktop/clientdb";
import { compileSlackFilter } from "@aca/desktop/ui/Filters/slackModel";
import { IconTarget } from "@aca/ui/icons";

export const LIST_SYSTEM_IDS = {
  important: "important",
} as const;

export const SYSTEM_LISTS_TIP: Record<ListSystemId, string> = {
  important: `This is list of your important notifications. Use filter tools above to decide which notifications should automatically show up here.`,
};

export type ListSystemId = typeof LIST_SYSTEM_IDS[keyof typeof LIST_SYSTEM_IDS];

export const CUSTOM_SYSTEM_LIST_ICONS: Record<keyof typeof LIST_SYSTEM_IDS, ReactNode> = {
  important: <IconTarget />,
};

export function ensureSystemListsCreated() {
  let shouldBeCreated = false;
  autorun(() => {
    const db = getNullableDb();

    if (!db) return;

    const importantList = db.notificationList.findFirst({ system_id: LIST_SYSTEM_IDS.important });

    if (importantList) return;

    if (shouldBeCreated) {
      console.warn("Should be created already");
      return;
    }

    runInAction(() => {
      db.notificationList.create({
        title: "Important",
        system_id: LIST_SYSTEM_IDS.important,
        filters: [compileSlackFilter({ directMessages: { type: "everyone" }, mentions: { type: "everyChannel" } })],
      });

      shouldBeCreated = true;
    });
  });
}
