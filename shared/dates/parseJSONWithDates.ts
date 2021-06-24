import { parseISO } from "date-fns";

/**
 * 2013-10-21T13:28:06.419Z >>> 24 chars
 * 2012-04-21T18:25:43-05:00 (ISO 8601) >>> 25 chars
 */
const JSON_DATE_STRING_MIN_LENGTH = 24;

function tryParseISOStringDate<T>(input: T): Date | T {
  if (typeof input !== "string") return input;

  if (input.length < JSON_DATE_STRING_MIN_LENGTH) return input;

  try {
    const date = parseISO(input);

    if (isNaN(date.getTime())) {
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
