import { v4 as uuid } from "uuid";
import database from "../database";

export async function updateUser(user: User): Promise<User> {
  const [databaseUser] = await database("user")
    .update({
      email: user.email,
      name: user.name,
      avatar_url: user.avatarUrl,
    })
    .where({ id: user.id })
    .returning(["id", "email", "name", "avatar_url", "created_at"]);
  return convertDatabaseUser(databaseUser);
}

export async function findUserById(id: string): Promise<User | null> {
  return findBy({ id });
}

async function findBy(query: Record<string, string>): Promise<User | null> {
  const [databaseUser] = await database
    .select(["id", "email", "name", "avatar_url", "created_at"])
    .from("user")
    .where(query)
    .limit(1);

  if (databaseUser) {
    return convertDatabaseUser(databaseUser);
  }

  return null;
}

export async function createUser({
  email,
  name,
  avatarUrl,
}: {
  email?: string;
  name?: string;
  avatarUrl?: string;
}): Promise<User> {
  const [databaseUser] = await database("user")
    .insert({
      id: uuid(),
      email,
      name,
      avatar_url: avatarUrl,
    })
    .returning(["id", "email", "name", "avatar_url", "created_at"]);
  return convertDatabaseUser(databaseUser);
}

export interface User {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  createdAt: Date;
  lastActiveAt: Date;
}

interface DatabaseUser {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  created_at: Date;
  last_active_at: Date;
}

function convertDatabaseUser(databaseUser: DatabaseUser): User {
  return {
    id: databaseUser.id,
    email: databaseUser.email,
    name: databaseUser.name,
    avatarUrl: databaseUser.avatar_url,
    createdAt: databaseUser.created_at,
    lastActiveAt: databaseUser.last_active_at,
  };
}
