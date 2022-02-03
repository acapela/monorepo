import { cachedComputed } from "@aca/clientdb";
import { fuzzySearch } from "@aca/shared/fuzzy/fuzzySearch";

import { NotificationsList } from "./defineList";
import { inboxLists } from "./preconfigured";

export const getListSearchTerms = cachedComputed((list: NotificationsList) => {
  return [list.name];
});

export function listsFuzzySearch(keyword: string) {
  if (!keyword.length) return [];

  return fuzzySearch(inboxLists, getListSearchTerms, keyword);
}
