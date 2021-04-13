import { db, User } from "~db";

// TODO: Not used?
export async function updateUser(user: User): Promise<User> {
  return await db.user.update({
    where: { id: user.id },
    data: {
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
    },
  });
}

export async function findUserById(id: string): Promise<User | null> {
  return (await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      avatar_url: true,
      created_at: true,
    },
  })) as User;
}

// Used in tests
export async function createUser({
  email,
  name,
  avatarUrl,
}: {
  email?: string;
  name?: string;
  avatarUrl?: string;
}): Promise<User> {
  return await db.user.create({
    data: { name, email, avatar_url: avatarUrl },
  });
}
