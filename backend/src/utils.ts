import { Request, Response } from "express";
import { extractAndAssertBearerToken } from "./authentication";
import { AuthenticationError } from "./errors/errorTypes";

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
