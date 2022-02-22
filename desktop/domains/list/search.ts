import { cachedComputed } from "@aca/clientdb";
import { fuzzySearch } from "@aca/shared/fuzzy/fuzzySearch";

import { getInboxLists } from "./all";
import { NotificationsList } from "./defineList";

export const getListSearchTerms = cachedComputed((list: NotificationsList) => {
  return [list.name];
});

export function listsFuzzySearch(keyword: string) {
  if (!keyword.length) return [];

  return fuzzySearch(getInboxLists(), getListSearchTerms, keyword);
}
