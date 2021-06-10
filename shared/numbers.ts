export function pluralize(count: number, singular: string, plural: string) {
  if (count === 1) {
    return `${count} ${singular}`;
  }

  return `${count} ${plural}`;
}

export function formatNumberWithMaxCallback(inputNumber: number, max: number) {
  return inputNumber < max ? inputNumber : `${max}+`;
}
