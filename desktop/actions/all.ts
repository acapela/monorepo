import { AnyStarImport, convertStarImportsToList } from "@aca/shared/imports";

import { ActionData, getIsAction } from "./action";
import * as appActions from "./app";
import * as authActions from "./auth";
import * as composeActions from "./compose";
import * as devActions from "./dev";
import * as focusActions from "./focus";
import * as groupActions from "./group";
import * as listsActions from "./lists";
import * as navigationActions from "./navigation";
import * as notificationActions from "./notification";
import * as searchActions from "./search";
import * as settingsActions from "./settings";
import * as slackActions from "./slack";
import * as snoozeActions from "./snooze";

export * as appActions from "./app";
export * as authActions from "./auth";
export * as composeActions from "./compose";
export * as devActions from "./dev";
export * as focusActions from "./focus";
export * as listsActions from "./lists";
export * as navigationActions from "./navigation";
export * as notificationActions from "./notification";
export * as settingsActions from "./settings";
export * as slackActions from "./slack";
export * as snoozeActions from "./snooze";
export * as searchActions from "./search";
export * as groupActions from "./group";

/**
 * Convert all '* as' imports into list of actions
 */
export const allActions = composeActionsFromImports(
  authActions,
  slackActions,
  listsActions,
  navigationActions,
  composeActions,
  devActions,
  focusActions,
  appActions,
  notificationActions,
  snoozeActions,
  settingsActions,
  searchActions,
  groupActions
);

/**
 * To make it easy to have up-to-date list of all actions, here are small helpers that can convert
 *
 * import * as fooActions from './foo'
 *
 * into array of actions. It also makes sure to only return actions (as './foo' can export anything, not only actions)
 */

/**
 * Converts single '* as' import to list of actions
 */
function pickActions(actions: AnyStarImport): ActionData[] {
  const allImports = convertStarImportsToList(actions);

  return allImports
    .filter((someImport) => {
      if (getIsAction(someImport)) return true;

      if (Array.isArray(someImport) && getIsAction(someImport[0])) return true;

      return false;
    })
    .flat() as unknown as ActionData[];
}

/**
 * Convert multiple '* as' imports to list of actions
 */
export function composeActionsFromImports(...actionsImports: AnyStarImport[]): ActionData[] {
  return actionsImports.map(pickActions).flat();
}
