import { ActionContext } from "@aca/desktop/actions/action/context";

import { focusPageView } from "./focus";
import { listPageView } from "./list";

export function goToOrFocusNextItem(context: ActionContext) {
  context.view(focusPageView)?.goToNextNotification();
  context.view(listPageView)?.focusNextItem();
}

//
