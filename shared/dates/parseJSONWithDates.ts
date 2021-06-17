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
  return tryParseStringDate(originalValue);
}

export function parseJsonWithDates<T = any>(input: string): T {
  return JSON.parse(input, jsonRetriever) as T;
}
