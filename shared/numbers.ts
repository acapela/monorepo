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
