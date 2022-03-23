export function countRepeats<I, R>(input: I[], getter: (item: I) => R | undefined): Map<R, number> {
  const resultsMap = new Map<R, number>();

  for (const item of input) {
    const result = getter(item);

    if (result === undefined) continue;

    const currentCount = resultsMap.get(result) ?? 0;

    resultsMap.set(result, currentCount + 1);
  }

  return resultsMap;
}
