import { ActionData, resolveActionDataThunk } from "@aca/desktop/actions/action";
import { ActionContext } from "@aca/desktop/actions/action/context";
import { groupBy } from "@aca/shared/groupBy";

export function groupActions(actions: ActionData[], context: ActionContext) {
  const groups = groupBy(
    actions,
    (action) => resolveActionDataThunk(action.group, context),
    (group) => group?.id ?? "no-group"
  );

  // const sortedGroups = sortArrayBySortList(groups, (group) => group.groupItem, groupsPriority);

  const flatItemsByGroups = groups.map((group) => group.items).flat();

  return [groups, flatItemsByGroups] as const;
}
