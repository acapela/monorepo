import { v4 as uuid } from "uuid";
import database from "./database";

export async function createOrFindUser({
  email,
  firebaseId,
  name,
}: {
  email: string;
  firebaseId: string;
  name: string;
}): Promise<User> {
  const user = await findUserByFirebaseId(firebaseId);
  if (user) {
    return user;
  }
  return createUser({ email, firebaseId, name });
}

export async function findUserByFirebaseId(firebaseId: string): Promise<User | null> {
  const [databaseUser] = await database
    .select(["id", "email", "firebase_id", "name", "avatar_url", "created_at"])
    .from("user")
    .where({ firebase_id: firebaseId })
    .limit(1);

  if (databaseUser) {
    return convertDatabaseUser(databaseUser);
  }

  return null;
}

export async function createUser({
  email,
  firebaseId,
  name,
}: {
  email: string;
  firebaseId: string;
  name: string;
}): Promise<User> {
  const [databaseUser] = await database("user")
    .insert({
      id: uuid(),
      email,
      name,
      firebase_id: firebaseId,
    })
    .returning(["id", "email", "firebase_id", "name", "avatar_url", "created_at"]);
  return convertDatabaseUser(databaseUser);
}

export interface User {
  id: string;
  email: string;
  firebaseId: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
  lastActiveAt: Date;
}

interface DatabaseUser {
  id: string;
  email: string;
  firebase_id: string;
  name: string;
  avatar_url?: string;
  created_at: Date;
  last_active_at: Date;
}

function convertDatabaseUser(databaseUser: DatabaseUser): User {
  return {
    id: databaseUser.id,
    email: databaseUser.email,
    firebaseId: databaseUser.firebase_id,
    name: databaseUser.name,
    avatarUrl: databaseUser.avatar_url,
    createdAt: databaseUser.created_at,
    lastActiveAt: databaseUser.last_active_at,
  };
}
