import React from "react";

import { getDb } from "@aca/desktop/clientdb";
import { IconPlus } from "@aca/ui/icons";

import { addToast } from "../domains/toasts/store";
import { defineAction } from "./action";

export const createNewBoardColumn = defineAction({
  icon: <IconPlus />,
  name: (ctx) => (ctx.isContextual ? "Add" : "Add new label"),
  handler: () => ({
    searchPlaceholder: "New status name...",
    getActions: () => [
      defineAction({
        name: (ctx) => `Create status "${ctx.searchKeyword}"`,
        handler(ctx) {
          const title = ctx.searchKeyword.trim();
          if (!title) {
            return false;
          }

          getDb().notificationStatusLabel.create({ name: title, order: "AA" });

          addToast({
            title: `New status label created`,
            message: title,
          });
        },
      }),
    ],
  }),
});
