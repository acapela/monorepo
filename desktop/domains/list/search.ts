import { cachedComputed } from "@aca/clientdb";
import { fuzzySearch } from "@aca/desktop/domains/commandMenu/search/fuzzySearch";

import { DefinedList } from "./defineList";
import { inboxLists } from "./preconfigured";

export const getListSearchTerms = cachedComputed((list: DefinedList) => {
  return [list.name];
});

export function listsFuzzySearch(keyword: string) {
  if (!keyword.length) return [];

  return fuzzySearch(inboxLists, getListSearchTerms, keyword);
}
