import { ActionContext } from "@aca/desktop/actions/action/context";

import { focusPageView } from "./focus";
import { listPageView } from "./list";

export function focusNextItem(context: ActionContext) {
  context.view(focusPageView)?.focusNextItem();
  context.view(listPageView)?.focusNextItem();
}

export function displayZenMode(context: ActionContext) {
  context.view(focusPageView)?.displayZenMode();
  context.view(listPageView)?.displayZenMode();
}
