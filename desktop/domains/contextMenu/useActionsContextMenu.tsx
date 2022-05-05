import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { ActionContext, useActionContext } from "@aca/desktop/actions/action/context";
import { resolveGroupData } from "@aca/desktop/actions/action/group";
import { useEqualRef } from "@aca/shared/hooks/useEqualRef";

import { runAction } from "../runAction";
import { RefOrElement } from "./refOrElement";
import { ContextMenuItemWithCallback, useContextMenu } from "./useContextMenu";

type MaybeGroupsOfActions = ActionData[] | ActionData[][];

function prepareContextMenuItemsFromActions(
  actions: MaybeGroupsOfActions,
  context: ActionContext
): ContextMenuItemWithCallback[] {
  const result: ContextMenuItemWithCallback[] = [];

  actions.forEach((actionOrGroup, index) => {
    if (Array.isArray(actionOrGroup)) {
      const contextMenuItemsOfGroup = actionOrGroup.map((action) => {
        return convertActionToContextMenuItem(action, context, `${index}`);
      });

      result.push(...contextMenuItemsOfGroup);
    } else {
      result.push(convertActionToContextMenuItem(actionOrGroup, context));
    }
  });

  return result.filter((action) => action.enabled);
}

function convertActionToContextMenuItem(
  action: ActionData,
  context: ActionContext,
  group?: string
): ContextMenuItemWithCallback {
  const { id, name, shortcut, canApply, group: groupFromAction } = resolveActionData(action, context);

  const groupFromActionName = groupFromAction ? resolveGroupData(groupFromAction, context).name : undefined;

  return {
    id,
    label: name,
    group: group ?? groupFromActionName,
    enabled: canApply(context),
    shortcut: shortcut,
    onSelected() {
      runAction(action, context);
    },
  };
}

export function useActionsContextMenu(
  refOrElement: RefOrElement,
  actions: ActionData[] | ActionData[][],
  target?: unknown
) {
  const context = useActionContext(target, { isContextual: true });

  const equalActions = useEqualRef(actions);

  useContextMenu(refOrElement, () => {
    return prepareContextMenuItemsFromActions(equalActions, context);
  });
}
