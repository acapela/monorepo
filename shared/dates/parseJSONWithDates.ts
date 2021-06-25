import { parseISO } from "date-fns";

/**
 * 2013-10-21T13:28:06.419Z >>> 24 chars
 * 2012-04-21T18:25:43-05:00 (ISO 8601) >>> 25 chars
 */

// https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
const isoRegexp = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

function tryParseISOStringDate<T>(input: T): Date | T {
  if (typeof input !== "string") return input;

  if (!isoRegexp[Symbol.match](input)) return input;

  try {
    const date = parseISO(input);

    if (!date || isNaN(date.getTime())) {
      return input;
    }

    return date;
  } catch (error) {
    return input;
  }
}

export function tryParseStringDate(originalValue: unknown) {
  if (typeof originalValue !== "string") {
    return originalValue;
  }

  const parseResult = Date.parse(originalValue);

  if (isNaN(parseResult)) {
    return originalValue;
  }

  return new Date(parseResult);
}

function jsonRetriever(key: string, originalValue: unknown) {
  return tryParseISOStringDate(originalValue);
}

export function parseJsonWithDates<T>(input: string): T {
  return JSON.parse(input, jsonRetriever) as T;
}

export function parseDatesInObject<T>(input: T): T {
  return parseJsonWithDates(JSON.stringify(input));
}

const dateKeys: Array<string> = ["created_at", "updated_at", "finished_at", "deadline", "used_at"];

function jsonRetrieverForDateKeys(key: string, originalValue: unknown) {
  if (!dateKeys.includes(key)) return originalValue;
  return tryParseISOStringDate(originalValue);
}

export function parseJsonWithDatesOnlyForValidKeys<T>(input: string): T {
  return JSON.parse(input, jsonRetrieverForDateKeys) as T;
}
