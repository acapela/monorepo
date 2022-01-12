import { JsonValue } from "@aca/shared/types";

export function tryParseStringDate(originalValue: unknown): Date | null {
  if (typeof originalValue !== "string") {
    return null;
  }

  const parseResult = Date.parse(originalValue);

  if (isNaN(parseResult)) {
    return null;
  }

  return new Date(parseResult);
}

/**
 * Will get JSON value of any provided input. It'll also properly modify the type of the input (Dates will become strings)
 */
export function getJSONValue<T>(input: T): JsonValue<T> {
  return typeSafeParseJSON(JSON.stringify(input));
}

export function typeSafeParseJSON<T>(input: string): JsonValue<T> {
  return JSON.parse(input);
}
