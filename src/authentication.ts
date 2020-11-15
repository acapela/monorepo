import { Request, Response, Router } from "express";

import firebase from "./firebase";
import { HttpStatus } from "./http";
import { createOrFindUser, User } from "./users";
import { AuthenticationError, UnprocessableEntityError } from "./errors";

export const router = Router();

router.post("/v1/users", verifyAuthentication, async (_, res) => {
  const firebaseToken: FirebaseTokenInfo = res.locals.firebaseTokenInfo;
  const firebaseUser: FirebaseUser = await getFirebaseUser(firebaseToken.id);
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
  } catch (e) {
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
      "x-hasura-allowed-roles": ["user"], // TODO: dynamically load this from the database
      "x-hasura-default-role": "user",
    },
  });
}

function extractFirebaseTokenInfoFromClaims(claims: firebase.auth.DecodedIdToken) {
  return { id: claims.sub };
}

async function getFirebaseUser(id: string): Promise<FirebaseUser> {
  const user = await firebase.auth().getUser(id);
  if (!user) {
    throw new UnprocessableEntityError("No firebase user exists for the given user id");
  }
  if (!user.emailVerified || !user.email) {
    throw new UnprocessableEntityError("Email of the user is missing or not yet verified");
  }
  return {
    id: user.uid,
    verifiedEmail: user.email,
    name: user.displayName || user.email,
    avatarUrl: user.photoURL,
  };
}

interface FirebaseUser {
  id: string;
  verifiedEmail: string;
  name: string;
  avatarUrl?: string;
}

interface FirebaseTokenInfo {
  id: string;
}
