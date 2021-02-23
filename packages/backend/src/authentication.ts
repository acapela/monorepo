import { Request, Response, Router } from "express";

import firebase, { getFirebaseUser } from "./firebase";
import { HttpStatus } from "./http";
import { createOrFindUser, User } from "./users/users";
import { AuthenticationError, UnprocessableEntityError } from "./errors";
import logger from "./logger";

export const router = Router();

router.post("/v1/users", verifyAuthentication, async (_, res) => {
  const firebaseToken: FirebaseTokenInfo = res.locals.firebaseTokenInfo;
  const firebaseUser = await getFirebaseUser(firebaseToken.id);
  if (!firebaseUser) {
    throw new UnprocessableEntityError("No firebase user found");
  }
  const user = await createOrFindUser({
    firebaseId: firebaseUser.id,
    email: firebaseUser.verifiedEmail,
    name: firebaseUser.name,
    avatarUrl: firebaseUser.avatarUrl,
  });
  await addHasuraClaimsForUser(user);
  res.status(HttpStatus.OK).json(user);
});

async function verifyAuthentication(req: Request, res: Response, next: (error?: Error) => void) {
  const token = extractToken(req.get("Authorization") || "");
  let claims;
  try {
    claims = await firebase.auth().verifyIdToken(token);
    res.locals.firebaseTokenInfo = extractFirebaseTokenInfoFromClaims(claims);
    next();
  } catch (error) {
    logger.error("Unexpected bearer token error", error);
    throw new AuthenticationError("Invalid bearer token");
  }
}

export function extractToken(header: string): string {
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

export function addHasuraClaimsForUser(user: User): Promise<void> {
  return firebase.auth().setCustomUserClaims(user.firebaseId, {
    "https://hasura.io/jwt/claims": {
      "x-hasura-user-id": user.id,
      "x-hasura-allowed-roles": ["user"], // TODO: dynamically load this from the database once we have roles
      "x-hasura-default-role": "user",
    },
  });
}

function extractFirebaseTokenInfoFromClaims(claims: firebase.auth.DecodedIdToken) {
  return { id: claims.sub };
}

interface FirebaseTokenInfo {
  id: string;
}
