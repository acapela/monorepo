import { User, db } from "~db";

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

export function getNormalizedUserName(user: User): string {
  if (user.name) {
    return user.name;
  }
  if (user.email) {
    return user.email;
  }
  return "Your colleague";
}
