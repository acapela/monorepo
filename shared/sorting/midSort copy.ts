interface FillerInput<R> {
  previousKnown: R | undefined;
  nextKnown: R | undefined;
  count: number;
}

function fillGaps<I, R>(
  items: I[],
  getter: (item: I) => R | undefined,
  filler: (previousKnown: R | undefined, nextKnown: R | undefined, count: number) => R
): R[] {}
