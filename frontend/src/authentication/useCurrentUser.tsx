import { useSession } from "next-auth/react";

import { useDb } from "~frontend/clientdb";
import { UserEntity } from "~frontend/clientdb/user";
import { knownErrors } from "~frontend/errors/knownErrors";
import { assertDefined } from "~shared/assert";
import { UserTokenPayload } from "~shared/jwt";

export function useCurrentUserTokenData(): UserTokenPayload | null {
  const { data } = useSession();
  return data as ReturnType<typeof useCurrentUserTokenData>;
}

/**
 * User is pre-populated in _app.tsx file so if user is logged in, it'll never be loading with null user.
 *
 * Therefore in components that renders only on logged in use-cases, we can assert current user
 */
export function useAssetCurrentUserAuth(): UserTokenPayload {
  const user = useCurrentUserTokenData();

  const validatedUser = assertDefined(user, `Using useAssertCurrentUser with null user`);

  return validatedUser;
}

export function useAssertCurrentUser(): UserEntity {
  const validatedUser = useAssetCurrentUserAuth();
  const db = useDb();

  const user = db.user.assertFindById(validatedUser.id, knownErrors.sessionInvalid);

  return user;
}
