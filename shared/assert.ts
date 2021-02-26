export class AssertError extends Error {
  constructor(message: string) {
    super(`Assert error - ${message}`);
  }
}

export function assert(input: unknown, message: string): asserts input {
  if (input === undefined || input === null) {
    throw new AssertError(message);
  }
}
