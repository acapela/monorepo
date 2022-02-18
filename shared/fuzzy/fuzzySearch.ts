import { sortBy } from "lodash";
import { useMemo } from "react";

import { MaybeArray, convertMaybeArrayToArray } from "@aca/shared/array";

import { useMethod } from "../hooks/useMethod";
import { commandScore } from "./commandScore";

type TermsResult = MaybeArray<string>;

type TermGetter<T> = (item: T) => TermsResult;

function reverseWords(input: string) {
  return input.split(" ").reverse().join(" ");
}

function prepareTerm(term: string) {
  return term.trim().toLowerCase();
}

function isExactMatch(term: string, keyword: string) {
  term = prepareTerm(term);
  keyword = prepareTerm(keyword);

  return term.includes(keyword) || keyword.includes(term);
}

export function getItemFuzzyScore<T>(item: T, termGetter: TermGetter<T>, keyword: string) {
  let bestScore = Number.MIN_SAFE_INTEGER;

  const termsInput = termGetter(item);

  const terms = convertMaybeArrayToArray(termsInput);

  terms.push(terms.join(" "));

  if (terms.some((term) => isExactMatch(term, keyword))) {
    return 1;
  }

  for (const term of terms) {
    const score = commandScore(term, keyword);

    if (score > bestScore) {
      bestScore = score;
    }

    const reversedKeyword = reverseWords(keyword);

    const reversedScore = commandScore(term, reversedKeyword) / 2;

    if (reversedScore > bestScore) {
      bestScore = reversedScore;
    }
  }

  return bestScore * 0.9;
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
