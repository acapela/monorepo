import { AnimatePresence } from "framer-motion";
import { action } from "mobx";
import { observer } from "mobx-react";
import React from "react";

import { ActionData } from "@aca/desktop/actions/action";
import { runAction } from "@aca/desktop/domains/runAction";
import { uiStore } from "@aca/desktop/store/uiStore";
import { getObjectKey } from "@aca/shared/object";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";

import { CommandMenuView } from "./CommandMenuView";
import { createDefaultCommandMenuSession } from "./defaultSession";
import { commandMenuStore } from "./store";

export const CommandMenuManager = observer(function CommandMenuManager() {
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
    },
    { isEnabled: !!currentSession }
  );

  const handleActionSelected = action(function handleActionSelected(action: ActionData) {
    if (!currentSession) return;
    commandMenuStore.session = null;
    runAction(action, currentSession.actionContext);
  });

  return (
    <AnimatePresence exitBeforeEnter>
      {!!currentSession && (
        <CommandMenuView
          key={getObjectKey(currentSession.actionContext)}
          session={currentSession}
          onActionSelected={handleActionSelected}
        />
      )}
    </AnimatePresence>
  );
});
