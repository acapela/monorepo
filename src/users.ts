import { v4 as uuid } from 'uuid';
import database from './database';

export async function createOrFindUser({ email, firebaseId }: { email: string; firebaseId: string }): Promise<User> {
  const user = await findUserByFirebaseId(firebaseId);
  if (user) {
    return user;
  }
  return createUser({ email, firebaseId });
}

export async function findUserByFirebaseId(firebaseId: string): Promise<User | null> {
  const [databaseUser] = await database
    .select(['id', 'email', 'firebase_id'])
    .from('user')
    .where({ firebase_id: firebaseId })
    .limit(1);

  if (databaseUser) {
    return convertDatabaseUser(databaseUser);
  }

  return null;
}

export async function createUser({ email, firebaseId }: { email: string; firebaseId: string }): Promise<User> {
  const [databaseUser] = await database('user')
    .insert({
      id: uuid(),
      email,
      firebase_id: firebaseId,
    })
    .returning(['id', 'email', 'firebase_id']);
  return convertDatabaseUser(databaseUser);
}

export interface User {
  id: string;
  email: string;
  firebaseId: string;
}

interface DatabaseUser {
  id: string;
  email: string;
  firebase_id: string;
}

function convertDatabaseUser(databaseUser: DatabaseUser): User {
  return {
    id: databaseUser.id,
    email: databaseUser.email,
    firebaseId: databaseUser.firebase_id,
  };
}
