export type Nullish = null | undefined;

export function isNotNullish<T>(input: T | Nullish): input is T {
  return input !== null && input !== undefined;
}

export function removeNullishFromArray<T>(input: Array<T | Nullish>): T[] {
  return input.filter(isNotNullish);
}
