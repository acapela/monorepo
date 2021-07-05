export type Empty = null | undefined;

export function isNotEmpty<T>(input: T | Empty): input is T {
  return input !== null && input !== undefined;
}

export function removeEmptyFromArray<T>(input: Array<T | Empty>): T[] {
  return input.filter(isNotEmpty);
}
