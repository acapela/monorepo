import { useSession } from "next-auth/client";

import { useDb } from "~frontend/clientdb";
import { UserEntity } from "~frontend/clientdb/user";
import { assertDefined } from "~shared/assert";
import { UserTokenData } from "~shared/types/jwtAuth";

/**
 * This hook works exactly like default next-auth useSession, but has proper typing for user data and also does some
 * simple data mapping.
 */
function useUserAuth(): UserTokenData | null {
  const [session] = useSession();

  if (!session) return null;

  const id = get<string | null>(session, "sub", null);
  const picture = get<string | null>(session, "picture", null);

  return { ...session, id, picture } as unknown as UserTokenData;
}

function get<T>(target: Record<string, unknown> | null | void, key: string, defaultValue: T): T {
  if (!target) return defaultValue;

  const existingValue = Reflect.get(target, key) as T;

  return existingValue ?? defaultValue;
}

export function useCurrentUserTokenData(): UserTokenData | null {
  const user = useUserAuth();

  return user;
}

/**
 * User is pre-populated in _app.tsx file so if user is logged in, it'll never be loading with null user.
 *
 * Therefore in components that renders only on logged in use-cases, we can assert current user
 */
export function useAssetCurrentUserAuth(): UserTokenData {
  const user = useCurrentUserTokenData();

  const validatedUser = assertDefined(user, `Using useAssertCurrentUser with null user`);

  return validatedUser;
}

export function useAssertCurrentUser(): UserEntity {
  const validatedUser = useAssetCurrentUserAuth();
  const db = useDb();

  const user = db.user.assertFindById(
    validatedUser.id,
    `Using useAssertCurrentUser, but no user with id ${validatedUser.id} found`
  );

  return user;
}
