import { AnyStarImport, convertStarImportsToList } from "@aca/shared/imports";

import { ActionData, getIsAction } from "./action";
import * as authActions from "./auth";
import * as devActions from "./dev";
import * as focusActions from "./focus";
import * as listsActions from "./lists";
import * as navigationActions from "./navigation";

/**
 * Convert all '* as' imports into list of actions
 */
export const allActions = composeActionsFromImports(
  authActions,
  listsActions,
  navigationActions,
  devActions,
  focusActions
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
