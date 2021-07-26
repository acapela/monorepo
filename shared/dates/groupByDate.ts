import { sortBy } from "lodash";

interface ItemsDateGroup<I> {
  date: Date;
  items: I[];
}

export function groupByDate<I>(items: I[], dateGetter: (item: I) => Date): ItemsDateGroup<I>[] {
  const itemGroups: ItemsDateGroup<I>[] = [];

  for (const item of items) {
    const itemDate = dateGetter(item);

    let itemGroup = itemGroups.find((group) => {
      return group.date.getTime() === itemDate.getTime();
    });

    if (!itemGroup) {
      itemGroup = { date: itemDate, items: [item] };
      itemGroups.push(itemGroup);
    } else {
      itemGroup.items.push(item);
    }
  }

  return sortBy(itemGroups, (group) => group.date);
}
