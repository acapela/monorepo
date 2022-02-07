import { AnyStarImport, convertStarImportsToList } from "@aca/shared/imports";

import { ActionData, getIsAction } from "./action";
import * as appActions from "./app";
import * as authActions from "./auth";
import * as devActions from "./dev";
import * as focusActions from "./focus";
import * as listsActions from "./lists";
import * as navigationActions from "./navigation";
import * as notificationActions from "./notification";
import * as settingsActions from "./settings";
import * as slackActions from "./slack";
import * as snoozeActions from "./snooze";

/**
 * Convert all '* as' imports into list of actions
 */
export const allActions = composeActionsFromImports(
  authActions,
  slackActions,
  listsActions,
  navigationActions,
  devActions,
  focusActions,
  appActions,
  notificationActions,
  snoozeActions,
  settingsActions
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

  return allImports.filter(getIsAction) as unknown as ActionData[];
}

/**
 * Convert multiple '* as' imports to list of actions
 */
function composeActionsFromImports(...actionsImports: AnyStarImport[]): ActionData[] {
  return actionsImports.map(pickActions).flat();
}
