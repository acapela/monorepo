import { ActionData } from "@aca/desktop/actions/action";
import { groupsPriority } from "@aca/desktop/actions/groups";
import { sortArrayBySortList } from "@aca/shared/array";
import { groupBy } from "@aca/shared/groupBy";

export function groupActions(actions: ActionData[]) {
  const groups = groupBy(
    actions,
    (action) => action.group,
    (group) => group?.id ?? "no-group"
  );

  const sortedGroups = sortArrayBySortList(groups, (group) => group.groupItem, groupsPriority);

  const flatItemsByGroups = sortedGroups.map((group) => group.items).flat();

  return [sortedGroups, flatItemsByGroups] as const;
}
