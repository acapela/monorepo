import { isDate } from "lodash";

import { removePrefix } from "./text/substring";

const JSON_DATE_PREFIX = `$$date:`;

function stringifyJSONDate(date: Date) {
  return `${JSON_DATE_PREFIX}${date.toISOString()}`;
}

function maybeParseJSONDate(maybeJSONDate: string) {
  if (!maybeJSONDate.startsWith(JSON_DATE_PREFIX)) {
    return maybeJSONDate;
  }

  const dateISO = removePrefix(maybeJSONDate, JSON_DATE_PREFIX);

  return new Date(dateISO);
}

export function serliazeJSONWithDates<T>(data: T): string {
  return JSON.stringify(data, (key, value) => {
    if (isDate(value)) {
      return stringifyJSONDate(value);
    }

    return value;
  });
}
export function parseJSONWithDates<T>(json: string): T {
  return JSON.parse(json, (key, value) => {
    if (typeof value !== "string") {
      return value;
    }

    return maybeParseJSONDate(value);
  });
}
