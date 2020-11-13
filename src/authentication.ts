import { Request, Response, Router } from "express";

import firebase from "./firebase";
import { HttpStatus } from "./http";
import { createOrFindUser, User } from "./users";
import { AuthenticationError, UnprocessableEntityError } from "./errors";

export const router = Router();

router.post("/v1/users", verifyAuthentication, async (_, res) => {
  const firebaseUser: FirebaseUser = res.locals.firebaseUser;
  if (!firebaseUser.verifiedEmail) {
    throw new UnprocessableEntityError("Email of the user is missing or not yet verified");
  }
  const user = await createOrFindUser({
    firebaseId: firebaseUser.id,
    email: firebaseUser.verifiedEmail,
    name: "Heiki", // TODO: should we actually get this value from firebase identity?
  });
  await addHasuraClaimsForUser(user);
  res.status(HttpStatus.OK).json(user);
});

async function verifyAuthentication(req: Request, res: Response, next: (error?: Error) => void) {
  const token = extractToken(req.get("Authorization") || "");
  try {
    const claims = await firebase.auth().verifyIdToken(token);
    res.locals.firebaseUser = extractFirebaseUserFromClaims(claims);
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

function extractFirebaseUserFromClaims(claims: firebase.auth.DecodedIdToken): FirebaseUser {
  return {
    id: claims.sub,
    verifiedEmail: claims.email_verified && claims.email ? claims.email : null,
  };
}

interface FirebaseUser {
  id: string;
  verifiedEmail: string | null;
}
