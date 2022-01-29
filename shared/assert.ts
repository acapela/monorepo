import { IS_DEV } from "./dev";
import { Nullish, isNotNullish } from "./nullish";

export class AssertError extends Error {
  constructor(message: string) {
    super(`Assert error - ${message}`);
  }
}

export type MessageOrError = string | Error;

function getErrorFromMessageOrError(messageOrError: MessageOrError): Error {
  if (typeof messageOrError === "string") {
    return new AssertError(messageOrError);
  }

  return messageOrError;
}

export function assertDefined<T>(input: T | Nullish, messageOrError: MessageOrError): T {
  assert(isNotNullish(input), messageOrError);

  return input;
}

export function assert(input: unknown, messageOrError: MessageOrError): asserts input {
  if (input) {
    return;
  }

  const error = getErrorFromMessageOrError(messageOrError);

  if (IS_DEV) {
    console.error(error);
  }

  throw error;
}

export function unsafeAssertType<T>(input: unknown): asserts input is T {
  //
}

export async function assertGetAsync<T>(promise: Promise<T | Nullish>, messageOrError: MessageOrError): Promise<T> {
  try {
    const result = await promise;

    assert(result, messageOrError);
    return result;
  } catch (_) {
    const error = getErrorFromMessageOrError(messageOrError);

    throw error;
  }
}
