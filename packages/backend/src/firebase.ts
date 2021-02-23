import admin from "firebase-admin";
import { UnprocessableEntityError, InternalServerError } from "./errors";
import config from "./config";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: config.get("firebase.databaseUrl"),
});

/**
 * In general, using default admin credential works out of the box in Google Cloud env.
 * eg. Cloud functions etc.
 *
 * Locally, however in order to work - it requires `GOOGLE_APPLICATION_CREDENTIALS` env var with
 * path to credential file downloaded from firebase admin console.
 *
 * This function will make sure we have admin credential set up properly.
 */
export async function assertHasFirebaseAdminAccess(): Promise<boolean> {
  try {
    // Let's try to get admin access token silently.
    await admin.credential.applicationDefault().getAccessToken();

    return true;
  } catch (error) {
    // If we're not able to get it for any reason - throw error.
    throw new InternalServerError(
      "Unable to connect to firebase admin. Is this code running on Google Cloud env or is GOOGLE_APPLICATION_CREDENTIALS env var present?"
    );
  }
}

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
