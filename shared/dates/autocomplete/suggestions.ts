import { parseDate } from "chrono-node";
import { isPast, isSameDay, startOfDay } from "date-fns";
import { range as _range, sortBy, uniqBy, upperFirst } from "lodash";

import { fuzzySearch } from "@aca/shared/fuzzy/fuzzySearch";
import { permutation } from "@aca/shared/text/permutations/permutations";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export type Weekday = typeof weekdays[number];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type Month = typeof months[number];

const longUnit = ["Week", "Month", "Weekend", "Year"];

function range(start: number, end: number) {
  return _range(start, end + 1);
}

const chronoParsed = ["today", "tomorrow", "after tomorrow", "weekend"];

const monthDayOrdinal = range(1, 31).map(convertNumberToOrdinal);

export const suggestedDates = [
  ...chronoParsed,
  ...weekdays,
  // in a week
  ...permutation`next ${weekdays}`.getAll(),

  ...permutation`in ${["a", "1"]} ${["Week", "Month", "Year"]}`.getAll(),
  // in 3 days
  ...permutation`in ${range(2, 100)} ${["Days", "Months", "Years", "Weeks"]}`.getAll(),
  // end of next week
  ...permutation`${["end of", ""]} ${["", "next", " this"]} ${longUnit}`.getAll(),
  // start of next week
  ...permutation`${["start of", "beginning of"]} next ${longUnit}`.getAll(),
  ...permutation`${months} ${monthDayOrdinal}`.getAll(),
  // next January
  ...permutation`${["next", "end of", "start of", "beginning of"]} ${[...months]} ${["", "next year"]}`.getAll(),
  // This Friday
  ...permutation`this ${weekdays}`.getAll(),

  ...months,
  // Last day of December
  ...permutation`${["last day of"]} ${["", "next"]} ${["Week", "Month", "Year", ...months]}`.getAll(),
  // January next year
  ...permutation`${months} next year`.getAll(),
  // 12th of January [next year]
  ...permutation`
    ${monthDayOrdinal} 
    ${[...months.map((month) => `of ${month}`)]}
    ${["", "next year"]}
  `.getAll(),
  // 3th Friday of January
  ...permutation`
    ${range(1, 6).map(convertNumberToOrdinal)} 
    ${weekdays} 
    of 
    ${months} 
    ${["", "next year"]}
  `.getAll(),
]
  .map((text) => upperFirst(text.trim()))
  .reverse();

function convertNumberToOrdinal(i: number) {
  const j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

export interface DateSuggestion {
  text: string;
  date: Date;
  isExact?: boolean;
}

interface AutosuggestDateOptions {
  minScore?: number;
  maxResults?: number;
  allowPast?: boolean;
}

export function autosuggestDate(
  input: string,
  { minScore = 0.01, maxResults = 5, allowPast = false }: AutosuggestDateOptions = {}
): DateSuggestion[] {
  const matchingSuggestions = fuzzySearch(suggestedDates, (i) => i, input, minScore).slice(0, maxResults);

  const exactMatch = parseDate(input);

  const results: DateSuggestion[] = matchingSuggestions
    .map((suggestion): DateSuggestion => {
      return {
        text: suggestion,
        get date() {
          const result = parseDate(suggestion);

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          if (!result) return null!;

          return startOfDay(result);
        },
      };
    })
    .filter((result) => result.date);

  if (exactMatch) {
    const isAlreadyListed = results.some((suggestion) => isSameDay(suggestion.date, exactMatch));
    !isAlreadyListed && results.push({ text: input, date: exactMatch, isExact: true });
  }

  const dateUniqueResults = uniqBy(results, (result) => result.date.getTime());

  return sortBy(dateUniqueResults, (result) => -result.date.getTime()).filter((suggestion) => {
    if (!allowPast && isPast(suggestion.date)) return false;
    return true;
  });
}
