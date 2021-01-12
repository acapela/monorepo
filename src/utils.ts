import { Request, Response } from "express";
import { extractToken } from "./authentication";
import { AuthenticationError } from "./errors";
import config from "./config";

export function validateSecret(secretName: string, errorMessage: string) {
  return function (req: Request, _: Response, next: () => unknown): void {
    const token = extractToken(req.get("Authorization") || "");
    if (token !== config.get(secretName)) {
      throw new AuthenticationError(errorMessage);
    }
    next();
  };
}
