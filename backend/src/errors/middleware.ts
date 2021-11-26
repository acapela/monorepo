import { Request, Response } from "express";

import { HttpStatus } from "~backend/src/http";
import { logger } from "~backend/src/logger";

import { HttpError, NotFoundError, isHttpError } from "./errorTypes";

export function notFoundRouteMiddleware(): void {
  throw new NotFoundError();
}

interface ErrorResponseData {
  message: string;
  stack?: string;
}

function getResponseDataFromHttpError(error: HttpError) {
  const responseData: ErrorResponseData = { message: error.message };

  if (process.env.NODE_ENV !== "production") {
    responseData.stack = error.stack;
  }

  return responseData;
}

export function errorHandlerMiddleware(error: Error, req: Request, response: Response): void {
  function handleAsInternalError() {
    logger.error("Server encountered an internal server error", {
      errorMessage: error.message,
      stack: error.stack,
      url: req.url,
    });

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message } as ErrorResponseData);
  }

  if (!isHttpError(error) || !error.isPublicError) {
    return handleAsInternalError();
  }

  // Error is public.

  const status = error.status ?? HttpStatus.INTERNAL_SERVER_ERROR;

  const responseData = getResponseDataFromHttpError(error);

  response.status(status).json(responseData);
}
