import { Request, Response, Router } from 'express';
import admin from 'firebase-admin';
import firebase from 'firebase-admin';

import { createOrFindUser, User } from './users';
import { AuthenticationError } from './errors';

export const router = Router();

router.post('/users', verifyAuthentication, async (_, res) => {
  const firebaseUser: FirebaseUser = res.locals.firebaseUser;
  const user = await createOrFindUser({
    firebaseId: firebaseUser.id,
    email: firebaseUser.email!, // TODO: do we need email here? no guarantee it's there atm
  });
  await addHasuraClaimsForUser(user);
  res.status(200).json({
    id: user.id,
    firebaseId: user.firebaseId,
    email: user.email,
  });
});

async function verifyAuthentication(req: Request, res: Response, next: (error?: Error) => any) {
  const authenticationHeader = req.get('Authorization')!;
  if (!authenticationHeader) {
    throw new AuthenticationError('No authorization header present');
  }
  const type = authenticationHeader.slice(0, authenticationHeader.indexOf(' '));
  if (type !== 'Bearer') {
    throw new AuthenticationError('Unsupported authorization type');
  }
  const token = authenticationHeader.slice('Bearer '.length);
  if (!token) {
    throw new AuthenticationError('No bearer token present');
  }
  try {
    const claims = await firebase.auth().verifyIdToken(token);
    res.locals.firebaseUser = extractFirebaseUserFromClaims(claims);
    next();
  } catch (e) {
    throw new AuthenticationError('Invalid bearer token');
  }
}

function addHasuraClaimsForUser(user: User) {
  return firebase.auth().setCustomUserClaims(user.firebaseId, {
    'https://hasura.io/jwt/claims': {
      'x-hasura-user-id': user.id,
      'x-hasura-allowed-roles': ['user'], // TODO: dynamically load this from the database
      'x-hasura-default-role': 'user',
    },
  });
}

function extractFirebaseUserFromClaims(claims: admin.auth.DecodedIdToken): FirebaseUser {
  return {
    id: claims.sub,
    email: claims.email,
  };
}

interface FirebaseUser {
  id: string;
  email: string | undefined;
}
