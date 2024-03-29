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

import { SystemMenuItem } from "../systemMenu/SystemMenuItem";
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
      actionContext: createActionContext(currentSession?.actionContext.target, {
        isContextual: actionResult.isContextual ?? currentSession?.actionContext.isContextual,
        searchPlaceholder: actionResult.searchPlaceholder,
        initialSearchValue: actionResult.initialSearchValue,
        hideTarget: actionResult.hideTarget,
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

export const openCommandMenu = action((initialSearchKeyword?: string) => {
  if (commandMenuStore.session) {
    commandMenuStore.session = null;
    return;
  }
  commandMenuStore.session = createDefaultCommandMenuSession();

  if (initialSearchKeyword) {
    commandMenuStore.session.actionContext.searchKeyword = initialSearchKeyword;
  }
});

export const CommandMenuManager = observer(function CommandMenuManager() {
  const isLoggedIn = !!authStore.userTokenData;
  const currentSession = commandMenuStore.session;

  useShortcut(["Mod", "K"], () => {
    openCommandMenu();
  });

  useShortcut(
    "Esc",
    action(() => {
      commandMenuStore.session = null;
      return true;
    }),
    { isEnabled: !!currentSession, allowFocusedInput: true }
  );

  const handleActionSelected = action(async function handleActionSelected(action: ActionData) {
    if (!currentSession) return;

    await runAction(action, currentSession.actionContext);
  });

  if (!isLoggedIn) return null;

  return (
    <AnimatePresence>
      <SystemMenuItem
        label="Open command menu..."
        shortcut={["Mod", "K"]}
        path={["View"]}
        onClicked={openCommandMenu}
      />
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
