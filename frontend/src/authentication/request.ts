import { NextApiRequest } from "next";
import { parseJWTWithoutValidation } from "~shared/jwt";
import { Session } from "next-auth";
import { IncomingMessage } from "http";

type Empty = Record<string, never>;

export function getUserFromRequest<SessionData = Empty>(reqInput?: IncomingMessage) {
  if (!reqInput) return null;

  // Raw node request is enhanced in next.js with things like parsed cookies etc.
  const req = reqInput as NextApiRequest;
  const sessionToken = (req?.cookies?.["next-auth.session-token"] as string) ?? null;

  if (!sessionToken) {
    return null;
  }

  const userTokenContent = parseJWTWithoutValidation<Session & SessionData>(sessionToken);

  return userTokenContent;
}
