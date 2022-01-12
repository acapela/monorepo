import { IncomingMessage } from "http";

import { NextApiRequest } from "next";

import { parseJWTWithoutValidation } from "~shared/jwt";

type Empty = Record<string, never>;

export function getUserSessionTokenFromRequest(reqInput?: IncomingMessage): string | null {
  if (!reqInput) return null;

  // Raw node request is enhanced in next.js with things like parsed cookies etc.
  const req = reqInput as NextApiRequest;
  const sessionToken = req?.cookies?.["next-auth.session-token"] ?? null;

  return sessionToken;
}

export function getUserFromRequest<SessionData = Empty>(reqInput?: IncomingMessage) {
  const sessionToken = getUserSessionTokenFromRequest(reqInput);

  if (!sessionToken) {
    return null;
  }

  const userTokenContent = parseJWTWithoutValidation<SessionData>(sessionToken);

  return userTokenContent;
}
