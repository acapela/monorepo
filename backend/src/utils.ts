import { Request, Response } from "express";
import { extractToken } from "./authentication";
import { AuthenticationError } from "./errors";

export function middlewareRequreBearerToken(secretValue: string, errorMessage: string) {
  return function (req: Request, _: Response, next: () => unknown): void {
    const token = extractToken(req.get("Authorization") || "");

    if (!token) {
      throw new AuthenticationError(errorMessage);
    }

    if (token !== secretValue) {
      throw new AuthenticationError(errorMessage);
    }
    next();
  };
}
