export class AssertError extends Error {
  constructor(message: string) {
    super(`Assert error - ${message}`);
  }
}

type Empty = null | undefined;
type NotEmpty<T> = T extends Empty ? never : T;

type MessageOrError = string | Error;

function getErrorFromMessageOrError(messageOrError: MessageOrError): Error {
  if (typeof messageOrError === "string") {
    return new AssertError(messageOrError);
  }

  return messageOrError;
}

function isNotEmpty<T>(input: T | Empty): input is T {
  return input !== null && input !== undefined;
}

export function assertGet<T>(input: T | Empty, messageOrError: MessageOrError): T {
  assert(input, messageOrError);

  return input;
}

export function assert(input: unknown, messageOrError: MessageOrError): asserts input {
  if (isNotEmpty(input)) {
    return;
  }

  const error = getErrorFromMessageOrError(messageOrError);

  throw error;
}

export async function assertGetAsync<T>(promise: Promise<T | Empty>, messageOrError: MessageOrError): Promise<T> {
  try {
    const result = await promise;

    assert(result, messageOrError);
    return result;
  } catch (_) {
    const error = getErrorFromMessageOrError(messageOrError);

    throw error;
  }
}
