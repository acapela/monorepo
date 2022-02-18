export function formatNumberWithMaxValue(inputNumber: number, max: number, alwaysShowMoreIndicator = false) {
  if (inputNumber < max) {
    if (alwaysShowMoreIndicator) {
      return `${inputNumber}+`;
    }

    return `${inputNumber}`;
  }

  return `${max}+`;
}

export function getNumbersAverage(input: number[]) {
  const total = input.reduce((buffer, next) => buffer + next, 0);

  return total / input.length;
}

export function roundNumber(input: number, decimalPlaces = 2) {
  return Number(input.toFixed(decimalPlaces));
}

export function getTotal<T>(items: T[], numberGetter: (item: T) => number): number {
  let total = 0;

  for (const item of items) {
    total += numberGetter(item);
  }

  return total;
}
