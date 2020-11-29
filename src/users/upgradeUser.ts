import { ActionHandler } from "../actions/actionHandlers";
import { findUserById, updateUser, User } from "./users";
import { NotFoundError, UnprocessableEntityError } from "../errors";
import { getFirebaseUser as findFirebaseUser, FirebaseUser } from "../firebase";

export const upgradeCurrentUser: ActionHandler<void, { user_id: string }> = {
  actionName: "upgrade_current_user",

  async handle(userId) {
    const user = await getUserById(userId);
    const firebaseUser = await getFirebaseUser(user.firebaseId);
    if (!firebaseUser.verifiedEmail || !firebaseUser.name) {
      throw new UnprocessableEntityError("Cannot upgrade user as they have not linked new credentials to firebase");
    }
    const updatedUser = await updateUser({
      ...user,
      email: firebaseUser.verifiedEmail,
      name: firebaseUser.name,
      avatarUrl: firebaseUser.avatarUrl,
    });
    return { user_id: updatedUser.id };
  },
};

async function getUserById(id: string): Promise<User> {
  const user = await findUserById(id);
  if (!user) {
    throw new NotFoundError(`User with id ${id} not found`);
  }
  return user;
}

async function getFirebaseUser(firebaseId: string): Promise<FirebaseUser> {
  const firebaseUser = await findFirebaseUser(firebaseId);
  if (!firebaseUser) {
    throw new NotFoundError(`Firebase user ${firebaseId} not found`);
  }
  return firebaseUser;
}
