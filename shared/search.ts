import { useMemo } from "react";
import { isNotNullish } from "./nullish";
import { Maybe } from "./types";

export function removeAccents(input: string) {
  return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function prepareSearchString(input: string) {
  return removeAccents(input.trim().toLowerCase());
}

/**
 * Note: This function assumes input is already normalized and prepared (accents removed, trimmed etc)
 */
export function isSearchKeywordMatchingTerm(searchKeyword: string, term: string) {
  return term.includes(searchKeyword);
}

interface SearchItemData<T> {
  item: T;
  terms: string[];
}

export function useSearch<T>(items: T[], termsGetter: (item: T) => Array<Maybe<string>>) {
  const searchItemsData = useMemo<SearchItemData<T>[]>(() => {
    return items.map((item) => {
      return {
        item,
        terms: termsGetter(item).filter(isNotNullish).map(prepareSearchString),
      };
    });
  }, [items]);

  function search(query: string): T[] {
    const normalizedQuery = prepareSearchString(query);
    return searchItemsData
      .filter((searchItemData) => {
        return searchItemData.terms.some((term) => isSearchKeywordMatchingTerm(normalizedQuery, term));
      })
      .map((searchItemData) => searchItemData.item);
  }

  return search;
}
