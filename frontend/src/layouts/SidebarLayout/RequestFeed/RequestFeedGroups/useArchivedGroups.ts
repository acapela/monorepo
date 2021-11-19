import {
  endOfDay,
  endOfMonth,
  format,
  isAfter,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subBusinessDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { useMemo } from "react";

import { TopicEntity } from "~frontend/clientdb/topic";
import { groupByFilter } from "~shared/groupByFilter";

import { RequestsGroupProps } from "../RequestsGroup";

export const useArchivedGroups = (archived: TopicEntity[]) => {
  const archivedGroups = useMemo(() => {
    const groups: RequestsGroupProps[] = [];

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const toArchivedDate = (topic: TopicEntity) => new Date(topic.archived_at!);
    const happenedWithin = (compareDate: Date) => (topic: TopicEntity) => isAfter(toArchivedDate(topic), compareDate);

    const now = new Date();
    const sameTimeYesterday = subBusinessDays(now, 1);
    const sameTimeLastWeek = subWeeks(now, 1);
    const sameTimeLastMonth = subMonths(now, 1);

    const [today, notToday] = groupByFilter(archived, happenedWithin(startOfDay(now)));
    if (today.length > 0) {
      groups.push({ groupName: "Today", topics: today });
    }

    const [yesterday, notYesterday] = groupByFilter(notToday, happenedWithin(startOfDay(sameTimeYesterday)));
    if (yesterday.length > 0) {
      groups.push({ groupName: "Yesterday", topics: yesterday });
    }

    const [thisWeek, notThisWeek] = groupByFilter(notYesterday, happenedWithin(startOfWeek(now)));
    if (thisWeek.length > 0) {
      groups.push({ groupName: "Rest of this week", topics: thisWeek });
    }

    const [lastWeek, notLastWeek] = groupByFilter(notThisWeek, happenedWithin(startOfWeek(sameTimeLastWeek)));
    if (lastWeek.length > 0) {
      groups.push({ groupName: "Last week", topics: lastWeek });
    }

    const [restOfMonth, allRemaining] = groupByFilter(notLastWeek, happenedWithin(startOfMonth(sameTimeLastMonth)));
    if (restOfMonth.length > 0) {
      groups.push({ groupName: "Rest of month", topics: lastWeek });
    }

    let remainingDays = allRemaining;

    while (remainingDays.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const beginningOfMonth = new Date(remainingDays[0].archived_at!);

      const previousMonth = endOfMonth(endOfDay(subMonths(beginningOfMonth, 1)));

      const [month, remaining] = groupByFilter(remainingDays, happenedWithin(previousMonth));
      if (month.length > 0) {
        const groupName = format(beginningOfMonth, "MMMM uuuu");
        groups.push({ groupName, topics: month });
      }

      remainingDays = remaining;
    }

    return groups;
  }, [archived]);

  return archivedGroups;
};
