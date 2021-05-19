import { Request, Response } from "express";
import { extractAndAssertBearerToken } from "./authentication";
import { AuthenticationError } from "./errors";

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

export function isDev() {
  return !["staging", "production"].includes(process.env.STAGE);
}
