import { cachedComputed } from "@aca/clientdb";

import { fuzzySearch } from "../commandMenu/search/fuzzySearch";
import { DefinedList } from "./defineList";
import { preconfiguredLists } from "./preconfigured";

export const getListSearchTerms = cachedComputed((list: DefinedList) => {
  return [list.name];
});

export function listsFuzzySearch(keyword: string) {
  if (!keyword.length) return [];

  return fuzzySearch(preconfiguredLists, getListSearchTerms, keyword);
}
