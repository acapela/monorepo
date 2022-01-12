import { HttpStatus } from "@aca/backend/src/http";

export class HttpError extends Error {
  public readonly status: HttpStatus;
  public readonly isPublicError: boolean = false;
  public readonly isHttpError = true;

  constructor(status: HttpStatus, message: string) {
    super(message);
    this.status = status;
  }
}

export function isHttpError(input: unknown): input is HttpError {
  if (!input) return false;

  return (input as HttpError)?.isHttpError === true;
}

class PublicHttpError extends HttpError {
  public readonly isPublicError = true;
}

export class BadRequestError extends PublicHttpError {
  constructor(message = "Bad request") {
    super(HttpStatus.BAD_REQUEST, message);
  }
}

export class NotFoundError extends PublicHttpError {
  constructor(message = "Not found") {
    super(HttpStatus.NOT_FOUND, message);
  }
}

export class AuthenticationError extends PublicHttpError {
  constructor(message = "You are not authenticated") {
    super(HttpStatus.UNAUTHORIZED, message);
  }
}

export class UnprocessableEntityError extends PublicHttpError {
  constructor(message = "The request is invalid") {
    super(HttpStatus.UNPROCESSABLE_ENTITY, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = "Internal Server Error") {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message);
  }
}

export class PublicInternalServerError extends PublicHttpError {
  constructor(message = "Internal Server Error") {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message);
  }
}
