import { action } from "mobx";

import { ActionData } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { commandMenuStore } from "@aca/desktop/domains/commandMenu/store";
import { runAction } from "@aca/desktop/domains/runAction";
import { getIsShortcutDefinitionMatchingEvent } from "@aca/ui/keyboard/shortcutBase";

/**
 * Will attach global keyboard handler that will run corresponding actions.
 *
 * TODO: This will require some hook for dynamic actions (eg. custom lists created by users with custom shortcuts?)
 */
export function attachActionsShortcutsHandler(actions: ActionData[]) {
  document.body.addEventListener(
    "keydown",
    action((event) => {
      if (commandMenuStore.session) return;

      // TODO: Do not run actions if any input is focused

      const actionContext = createActionContext();

      const targetActions = actions
        /**
         * Now filter by those that can be applied
         */
        .filter((action) => {
          return action.canApply(actionContext);
        })
        /**
         * First filter actions leaving only those with matching shortcut definition
         */
        .filter((action) => {
          const shortcutDefinition = action.shortcut;

          if (!shortcutDefinition) return false;

          return getIsShortcutDefinitionMatchingEvent(shortcutDefinition, event);
        });

      if (!targetActions.length) return;

      /**
       * We don't want 2 actions fighting for the same shortcut ever.
       *
       * This is possible that 2 actions listen for the same shortcut, but at any moment, only one should
       * return true for 'canApply'.
       *
       * Example: 2 actions have 'Escape' shortcut ('exit focus mode' and 'exit settings') but both have corresponding
       * canApply making only at most 1 of them active at any time
       */
      if (targetActions.length > 1) {
        // Let's log conflicting actions for easy debugging
        console.warn(
          `Two or more actions wants to capture single shortcut. Ignoring shortcut to avoid conflicts`,
          targetActions
        );
        return;
      }

      // We know there is only 1 target action
      const [targetAction] = targetActions;

      event.preventDefault();
      event.stopPropagation();

      runAction(targetAction, actionContext);
    }),
    { capture: true }
  );
}
