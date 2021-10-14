type MaybeValue<T> = null | { value: T };

/**
 * Memoize that always runs the first function, but runs the second one only if result from the first one changed.
 *
 * Until first result is the same - it will memoize the 2nd one.
 */
export function conditionalMemoize<FirstResult, FinalResult>(
  firstResultGetter: () => FirstResult,
  finalResultGetter: (firstResult: FirstResult) => FinalResult
) {
  let lastFirstResult: MaybeValue<FirstResult> = null;
  let lastFinalResult: MaybeValue<FinalResult> = null;

  function get(): FinalResult {
    const newFirstResult = firstResultGetter();

    if (lastFirstResult && lastFirstResult.value === newFirstResult) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return lastFinalResult!.value;
    }

    lastFirstResult = { value: newFirstResult };

    const finalResult = finalResultGetter(lastFirstResult.value);

    lastFinalResult = { value: finalResult };

    return finalResult;
  }

  return get;
}
