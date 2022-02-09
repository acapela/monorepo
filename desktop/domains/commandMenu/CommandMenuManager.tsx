import { AnimatePresence } from "framer-motion";
import { action } from "mobx";
import { observer } from "mobx-react";
import React from "react";

import { ActionData } from "@aca/desktop/actions/action";
import { runAction } from "@aca/desktop/domains/runAction";
import { authStore } from "@aca/desktop/store/auth";
import { uiStore } from "@aca/desktop/store/ui";
import { getObjectKey } from "@aca/shared/object";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";

import { CommandMenuView } from "./CommandMenuView";
import { createDefaultCommandMenuSession } from "./defaultSession";
import { commandMenuStore } from "./store";

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
      uiStore.isSidebarOpened = false;
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

  const handleActionSelected = action(function handleActionSelected(action: ActionData) {
    if (!currentSession) return;
    commandMenuStore.session = null;
    runAction(action, currentSession.actionContext);
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
