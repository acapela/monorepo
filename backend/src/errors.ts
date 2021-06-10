import { Request, Response } from "express";
import { AssertError } from "~shared/assert";
import logger from "~shared/logger";
import { HttpStatus } from "./http";

export function notFoundRouteHandling(): void {
  throw new NotFoundError();
}

export function errorHandling(
  err: Error,
  _: Request,
  res: Response,
  /* eslint-disable */ next: () => void /* eslint-enable */
): void {
  const anyError = err as any; // eslint-disable-line
  const status = typeof anyError.status !== "undefined" ? anyError.status : HttpStatus.INTERNAL_SERVER_ERROR;
  if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
    logger.error("Server encountered an internal server error", {
      errorMessage: err.message,
      stack: err.stack,
    });
  }
  const response: { message: string; stack?: string } = {
    message: err.message || "Something went wrong",
  };
  // avoid leaking internal server errors from assertion failures externally
  if (err instanceof AssertError) {
    response.message = "Something went wrong";
  }
  if (process.env.NODE_ENV !== "production" && err.stack) {
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

export class BadRequestError extends HttpError {
  constructor(message = "Bad request") {
    super(HttpStatus.BAD_REQUEST, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not found") {
    super(HttpStatus.NOT_FOUND, message);
  }
}

export class AuthenticationError extends HttpError {
  constructor(message = "You are not authenticated") {
    super(HttpStatus.UNAUTHORIZED, message);
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message = "The request is invalid") {
    super(HttpStatus.UNPROCESSABLE_ENTITY, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error") {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message);
  }
}
