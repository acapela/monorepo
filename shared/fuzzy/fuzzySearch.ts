import { sortBy } from "lodash";
import { useMemo } from "react";

import { MaybeArray, convertMaybeArrayToArray } from "@aca/shared/array";

import { useMethod } from "../hooks/useMethod";
import { commandScore } from "./commandScore";

type TermsResult = MaybeArray<string>;

type TermGetter<T> = (item: T) => TermsResult;

export function getItemFuzzyScore<T>(item: T, termGetter: TermGetter<T>, keyword: string) {
  let bestScore = Number.MIN_SAFE_INTEGER;

  const termsInput = termGetter(item);

  const terms = convertMaybeArrayToArray(termsInput);

  for (const term of terms) {
    const score = commandScore(term, keyword);

    if (score > bestScore) {
      bestScore = score;
    }
  }

  return bestScore;
}

export function fuzzySearchWithScore<T>(items: T[], termsGetter: TermGetter<T>, keyword: string) {
  keyword = keyword.trim();
  const itemsWithScore = items.map((item) => {
    const score = getItemFuzzyScore(item, termsGetter, keyword);

    return { score, item };
  });

  const passingItems = itemsWithScore.filter((item) => item.score > 0);

  return sortBy(passingItems, (item) => item.score).reverse();
}

const DEFAULT_FUZZY_SEARCH_TRESHOLD = 0.09;

export function fuzzySearch<T>(
  items: T[],
  termsGetter: TermGetter<T>,
  keyword: string,
  minScore = DEFAULT_FUZZY_SEARCH_TRESHOLD
) {
  if (!keyword.trim()) {
    return items;
  }
  return fuzzySearchWithScore(items, termsGetter, keyword)
    .filter((item) => {
      return item.score >= minScore;
    })
    .map((result) => {
      return result.item;
    });
}

export function useFuzzySearch<T>(
  items: T[],
  termsGetter: TermGetter<T>,
  keyword: string,
  minScore = DEFAULT_FUZZY_SEARCH_TRESHOLD
) {
  const termsGetterRef = useMethod(termsGetter);
  return useMemo(
    () => fuzzySearch(items, termsGetterRef, keyword, minScore),
    [items, termsGetterRef, keyword, minScore]
  );
}
