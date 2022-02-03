import { ActionData, resolveActionDataThunk } from "@aca/desktop/actions/action";
import { ActionContext } from "@aca/desktop/actions/action/context";
import { groupsPriority } from "@aca/desktop/actions/groups";
import { sortArrayBySortList } from "@aca/shared/array";
import { groupBy } from "@aca/shared/groupBy";

export function groupActions(actions: ActionData[], context: ActionContext) {
  const groups = groupBy(
    actions,
    (action) => resolveActionDataThunk(action.group, context),
    (group) => group?.id ?? "no-group"
  );

  const sortedGroups = sortArrayBySortList(groups, (group) => group.groupItem, groupsPriority);

  const flatItemsByGroups = sortedGroups.map((group) => group.items).flat();

  return [sortedGroups, flatItemsByGroups] as const;
}
