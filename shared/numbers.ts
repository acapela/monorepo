export function pluralize(count: number, singular: string, plural: string) {
  if (count === 1) {
    return `${count} ${singular}`;
  }

  return `${count} ${plural}`;
}

export function formatNumberWithMaxCallback(inputNumber: number, max: number, alwaysShowMoreIndicator = true) {
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
