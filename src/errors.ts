import { Request, Response } from 'express';

export function notFoundRouteHandling(): void {
  throw new NotFoundError();
}

export function errorHandling(
  err: Error,
  req: Request,
  res: Response,
  /* eslint-disable */ next: () => void /* eslint-enable */
): void {
  const anyError = err as any; // eslint-disable-line
  const status = typeof anyError.status !== 'undefined' ? anyError.status : 500;
  const response: { message: string; stack?: string } = {
    message: err.message || 'Something went wrong',
  };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }
  res.status(status).json(response);
}

class HttpError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not found') {
    super(404, message);
  }
}

export class AuthenticationError extends HttpError {
  constructor(message = 'You are not authenticated') {
    super(401, message);
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message = 'The request is invalid') {
    super(422, message);
  }
}
