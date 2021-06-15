const jsonDateRegexp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z?$/;
const jsonFullMatcher = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z?/;

export function tryParseStringDate(originalValue: unknown) {
  if (typeof originalValue !== "string") {
    return originalValue;
  }

  const parseResult = Date.parse(originalValue);

  if (isNaN(parseResult)) {
    return originalValue;
  }

  return new Date(parseResult);

  const dateMatch = jsonDateRegexp.exec(originalValue);

  if (!dateMatch) {
    return originalValue;
  }

  return new Date(
    Date.UTC(
      +dateMatch[1],
      +dateMatch[2] - 1,
      +dateMatch[3],
      +dateMatch[4],
      +dateMatch[5],
      +dateMatch[6],
      +dateMatch[7]
    )
  );
}

function jsonRetriever(key: string, originalValue: unknown) {
  return tryParseStringDate(originalValue);
}

export function parseJsonWithDates<T = any>(input: string): T {
  /**
   * It's actually faster when I first check entire (potentially long ) json string if it includes dates before
   * parsing each individual field of it with retriever instead of letting native do all the job
   */
  // if (jsonFullMatcher.test(input)) {
  return JSON.parse(input, jsonRetriever) as T;
  // }

  return JSON.parse(input) as T;
}
