import firebase from "../../src/firebase";
import { createOrFindUser } from "../../src/users";
import { addHasuraClaimsForUser } from "../../src/authentication";

export const TEST_USER_UID = "test-user-uid";
export const TEST_USER_EMAIL = "acapela-test-user@acape.la";

export async function getTestUserToken() {
  const firebaseUser = await getOrCreateFirebaseTestUser();
  const user = await createOrFindUser({
    email: firebaseUser.email!,
    firebaseId: firebaseUser.uid,
  });
  await addHasuraClaimsForUser(user);
  const token = await firebase.auth().createCustomToken(firebaseUser.uid, {
    "https://hasura.io/jwt/claims": {
      "x-hasura-user-id": user.id,
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-default-role": "user",
    },
  });
  return token;
}

// We use an actual testing firebase user for tests
// this way, we can use an actual token when testing against hasura
async function getOrCreateFirebaseTestUser() {
  try {
    return await firebase.auth().getUser(TEST_USER_UID);
  } catch (e) {}
  const newTestUser = await firebase.auth().createUser({
    uid: TEST_USER_UID,
    email: TEST_USER_EMAIL,
  });
  return newTestUser;
}
