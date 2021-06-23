import { useSession } from "next-auth/client";
import { assertGet } from "~shared/assert";
import { UserTokenData } from "~shared/types/jwtAuth";

/**
 * This hook works exactly like default next-auth useSession, but has proper typing for user data and also does some
 * simple data mapping.
 */
function useAdjustedSession() {
  const [session] = useSession();

  if (!session) return null;

  const id = get<string | null>(session, "sub", null);
  const picture = get<string | null>(session, "picture", null);

  return { ...session, id, picture } as unknown as UserTokenData;
}

function get<T>(target: Record<string, unknown> | null | void, key: string, defaultValue: T) {
  if (!target) return defaultValue;

  const existingValue = Reflect.get(target, key) as T;

  return existingValue ?? defaultValue;
}

export function useCurrentUser() {
  const user = useAdjustedSession();

  console.log({ user });

  return user;
}

/**
 * User is pre-populated in _app.tsx file so if user is logged in, it'll never be loading with null user.
 *
 * Therefore in components that renders only on logged in use-cases, we can assert current user
 */
export function useAssertCurrentUser() {
  const user = useCurrentUser();

  const validatedUser = assertGet(user, `Using useAssertCurrentUser with null user`);

  return validatedUser;
}

export function useAssertCurrentTeamId() {
  const user = useAssertCurrentUser();

  return assertGet(user.currentTeamId, "No team id");
}
