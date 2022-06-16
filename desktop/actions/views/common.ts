import { ActionContext } from "@aca/desktop/actions/action/context";
import { getPrimaryNotification } from "@aca/desktop/domains/group/group";

import { focusPageView } from "./focus";
import { listPageView } from "./list";

export function focusNextItemIfAvailable(context: ActionContext) {
  const nextNotification = getNextContextItem(context);
  if (nextNotification && !getPrimaryNotification(nextNotification).isResolved) {
    return (context.view(focusPageView) ?? context.view(listPageView))?.focusNextItemIfAvailable();
  }
  const prevNotification = getPrevContextItem(context);
  if (prevNotification && !getPrimaryNotification(prevNotification).isResolved) {
    (context.view(focusPageView) ?? context.view(listPageView))?.focusPrevItemIfAvailable();
  }
}

export function getNextContextItem(context: ActionContext) {
  return context.view(focusPageView)?.nextNotification ?? context.view(listPageView)?.nextListItem;
}

export function getPrevContextItem(context: ActionContext) {
  return context.view(focusPageView)?.prevNotification ?? context.view(listPageView)?.prevListItem;
}

export function focusPrevItemIfAvailable(context: ActionContext) {
  const prevNotification = getPrevContextItem(context);
  if (prevNotification && !getPrimaryNotification(prevNotification).isResolved) {
    (context.view(focusPageView) ?? context.view(listPageView))?.focusPrevItemIfAvailable();
  }
  const nextNotification = getNextContextItem(context);
  if (nextNotification && !getPrimaryNotification(nextNotification).isResolved) {
    (context.view(focusPageView) ?? context.view(listPageView))?.focusNextItemIfAvailable();
  }
}

export function displayZenModeIfFinished(context: ActionContext) {
  (context.view(focusPageView) ?? context.view(listPageView))?.displayZenModeIfFinished();
}
