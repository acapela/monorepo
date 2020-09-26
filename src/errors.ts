import { Request, Response } from 'express';

export function notFoundRouteHandling() {
  throw new NotFoundError();
}

export function errorHandling(err: Error, req: Request, res: Response, next: () => any) {
  const status = typeof (err as any).status !== 'undefined' ? (err as any).status : 500;
  const response: { message: string } = { message: err.message || 'Something went wrong' };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    (response as any).stack = err.stack;
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
  constructor(message: string = 'Not found') {
    super(404, message);
  }
}

export class AuthenticationError extends HttpError {
  constructor(message: string = 'You are not authenticated') {
    super(401, message);
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message: string = 'The request is invalid') {
    super(422, message);
  }
}
