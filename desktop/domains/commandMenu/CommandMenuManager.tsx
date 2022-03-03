import { AnimatePresence } from "framer-motion";
import { action } from "mobx";
import { observer } from "mobx-react";
import React from "react";

import { ActionData } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { actionResultChannel, runAction } from "@aca/desktop/domains/runAction";
import { authStore } from "@aca/desktop/store/auth";
import { getObjectKey } from "@aca/shared/object";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";

import { CommandMenuView } from "./CommandMenuView";
import { createDefaultCommandMenuSession } from "./defaultSession";
import { createCommandMenuSession } from "./session";
import { commandMenuStore } from "./store";

actionResultChannel.subscribe(
  action((actionResult) => {
    const currentSession = commandMenuStore.session;

    if (actionResult === false) {
      return;
    }

    if (actionResult === undefined) {
      commandMenuStore.session = null;
      return;
    }

    commandMenuStore.session = createCommandMenuSession({
      actionContext: createActionContext(currentSession?.actionContext.forcedTarget, {
        isContextual: actionResult.isContextual ?? currentSession?.actionContext.isContextual,
        searchPlaceholder: actionResult.searchPlaceholder,
      }),
      getActions(context) {
        return actionResult.getActions(context);
      },
    });

    if (currentSession) {
      currentSession.actionContext.searchKeyword = "";
    }
  })
);

export const CommandMenuManager = observer(function CommandMenuManager() {
  const isLoggedIn = !!authStore.userTokenData;
  const currentSession = commandMenuStore.session;
  useShortcut(
    ["Mod", "K"],
    action(() => {
      if (commandMenuStore.session) {
        commandMenuStore.session = null;
        return;
      }
      commandMenuStore.session = createDefaultCommandMenuSession();
    })
  );

  useShortcut(
    "Esc",
    () => {
      commandMenuStore.session = null;
      return true;
    },
    { isEnabled: !!currentSession }
  );

  const handleActionSelected = action(async function handleActionSelected(action: ActionData) {
    if (!currentSession) return;

    await runAction(action, currentSession.actionContext);
  });

  if (!isLoggedIn) return null;

  return (
    <AnimatePresence>
      {!!currentSession && (
        <CommandMenuView
          key={getObjectKey(currentSession)}
          session={currentSession}
          onActionSelected={handleActionSelected}
        />
      )}
    </AnimatePresence>
  );
});
