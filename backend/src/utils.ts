import { createHmac } from "crypto";

import { Request, Response } from "express";
import { get } from "lodash";

import { getDevPublicTunnelURL } from "@aca/backend/src/localtunnel";
import { IS_DEV } from "@aca/shared/dev";
import { verifyJWT } from "@aca/shared/jwt";

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

export async function getPublicBackendURL() {
  if (IS_DEV) {
    return `${await getDevPublicTunnelURL(3000)}/api/backend`;
  }

  return process.env.BACKEND_API_ENDPOINT;
}

export function getSignedState(uid: string, oauthStateSecret: string): string {
  const hmac = createHmac("sha256", oauthStateSecret);
  hmac.update(uid);
  return `${uid}:${hmac.digest("hex")}`;
}

export async function getWebhookEndpoint(integration: "clickup" | "asana"): Promise<string> {
  return `${
    IS_DEV ? await getDevPublicTunnelURL(3000) : process.env.FRONTEND_URL
  }/api/backend/v1/${integration}/webhook`;
}
