import admin from "firebase-admin";
import { UnprocessableEntityError } from "./errors";
import config from "./config";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: config.get("firebase.databaseUrl"),
});

export async function getFirebaseUser(id: string): Promise<FirebaseUser | null> {
  const user = await admin.auth().getUser(id);
  if (!user) {
    return null;
  }
  if (user.email && !user.emailVerified) {
    throw new UnprocessableEntityError("Email of the user is not yet verified");
  }
  return {
    id: user.uid,
    verifiedEmail: user.email,
    name: user.displayName || user.email,
    avatarUrl: user.photoURL,
  };
}

export interface FirebaseUser {
  id: string;
  verifiedEmail?: string;
  name?: string;
  avatarUrl?: string;
}

export default admin;
