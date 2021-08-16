import { Router } from "express";

import { AuthenticationError } from "./errors/errorTypes";

export const router = Router();

export function extractAndAssertBearerToken(header: string): string {
  if (!header) {
    throw new AuthenticationError("No authorization header present");
  }
  const type = header.slice(0, header.indexOf(" "));
  if (type !== "Bearer") {
    throw new AuthenticationError("Unsupported authorization type");
  }
  const token = header.slice("Bearer ".length);
  if (!token) {
    throw new AuthenticationError("No bearer token present");
  }
  return token;
}
