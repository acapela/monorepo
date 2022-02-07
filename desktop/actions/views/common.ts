import { ActionContext } from "@aca/desktop/actions/action/context";

import { focusPageView } from "./focus";
import { listPageView } from "./list";

export function displayZenModeOrFocusNextItem(context: ActionContext) {
  context.view(focusPageView)?.displayZenModeOrFocusNextItem();
  context.view(listPageView)?.displayZenModeOrFocusNextItem();
}

//
