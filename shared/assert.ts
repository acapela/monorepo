export class AssertError extends Error {
  constructor(message: string) {
    super(`Assert error - ${message}`);
  }
}

type Empty = null | undefined;

function isNotEmpty<T>(input: T | Empty): input is T {
  return input !== null && input !== undefined;
}

export function assertGet<T>(input: T | Empty, message: string): T {
  if (isNotEmpty(input)) {
    return input;
  }
  throw new AssertError(message);
}
