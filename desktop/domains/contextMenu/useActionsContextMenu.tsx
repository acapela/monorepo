import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { createActionContext } from "@aca/desktop/actions/action/context";
import { useEqualRef } from "@aca/shared/hooks/useEqualRef";
import { useMemo } from "react";

import { runAction } from "../runAction";
import { RefOrElement } from "./refOrElement";
import { ContextMenuItem } from "./types";
import { useContextMenu } from "./useContextMenu";

export function useActionsContextMenu(refOrElement: RefOrElement, actions: ActionData[], target?: unknown) {
  const context = createActionContext(target);

  const equalActions = useEqualRef(actions);

  const menuItems = useMemo(() => {
    return equalActions.map((action): ContextMenuItem => {
      const { id, name, shortcut, canApply } = resolveActionData(action, context);

      return {
        id,
        label: name,
        enabled: canApply(context),
        shortcut: shortcut,
      };
    });
  }, [context, equalActions]);

  useContextMenu(refOrElement, menuItems, (item) => {
    if (!item.id) return;

    const correspondingAction = actions.find((action) => action.id === item.id);

    if (!correspondingAction) return;

    runAction(correspondingAction, context);
  });
}
