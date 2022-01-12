import { mapGetOrCreate } from "@aca/shared/map";

interface Group<I, G> {
  groupItem: G;
  items: I[];
}

export function groupBy<I, G>(
  items: I[],
  groupItemGetter: (item: I) => G,
  groupKeyGetter: (groupItem: G) => string
): Group<I, G>[] {
  const groupsMap = new Map<string, Group<I, G>>();

  for (const item of items) {
    const groupItem = groupItemGetter(item);
    const groupKey = groupKeyGetter(groupItem);

    const groupData = mapGetOrCreate(groupsMap, groupKey, () => ({ groupItem, items: [] }));

    groupData.items.push(item);
  }

  return [...groupsMap.values()];
}
