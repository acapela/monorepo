import { ActionContext } from "@aca/desktop/actions/action/context";

import { focusPageView } from "./focus";
import { listPageView } from "./list";

export function focusNextItemIfAvailable(context: ActionContext) {
  (context.view(focusPageView) ?? context.view(listPageView))?.focusNextItemIfAvailable();
}

export function displayZenModeIfFinished(context: ActionContext) {
  (context.view(focusPageView) ?? context.view(listPageView))?.displayZenModeIfFinished();
}
