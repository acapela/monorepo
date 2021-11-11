import { Request, Response } from "express";
import { get } from "lodash";

import { verifyJWT } from "~shared/jwt";

import { extractAndAssertBearerToken } from "./authentication";
import { AuthenticationError, BadRequestError } from "./errors/errorTypes";

export function middlewareRequireBearerToken(secretValue: string, errorMessage: string) {
  return function (req: Request, _: Response, next: () => unknown): void {
    const token = extractAndAssertBearerToken(req.get("Authorization") || "");

    if (!token) {
      throw new AuthenticationError(errorMessage);
    }

    if (token !== secretValue) {
      throw new AuthenticationError(errorMessage);
    }
    next();
  };
}

export function isValidDateString(dateString: string) {
  return !isNaN(Date.parse(dateString));
}

export function isValidOptionalDateArgument(dateString?: string) {
  return dateString === undefined || isValidDateString(dateString);
}

export function assertDateString(dateString: unknown, message = "Incorrect date string"): asserts dateString is string {
  if (!isValidOptionalDateArgument(dateString as string)) {
    throw new Error(message);
  }
}

export function assertDate(dateString: unknown, message = "Incorrect date string"): asserts dateString is Date {
  if (!isValidOptionalDateArgument(dateString as string)) {
    throw new Error(message);
  }
}

export function getUserIdFromRequest(req: Request): string {
  const jwtToken = req.cookies["next-auth.session-token"];

  if (!jwtToken) {
    throw new BadRequestError("session token missing");
  }

  let session;
  try {
    session = verifyJWT(jwtToken);
  } catch (e) {
    throw new AuthenticationError();
  }

  const userId = get(session, "id");
  if (!userId) {
    throw new BadRequestError("user id missing");
  }
  return userId;
}
