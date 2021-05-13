import { useSession } from "next-auth/client";
import { assert } from "~shared/assert";

/**
 * We are passing custom data to session JWT token, so we have more data than default next-auth Session type.
 */
interface SessionData {
  email: string;
  iat: number;
  name: string;
  picture: string | null;
  sub: string;
  id: string;
}

/**
 * This hook works exactly like default next-auth useSession, but has proper typing for user data and also does some
 * simple data mapping.
 */
function useAdjustedSession() {
  const [session, isLoading] = useSession();

  function getSessionData(): SessionData | null {
    if (!session) return null;

    const id = get<string | null>(session, "sub", null);
    const picture = get<string | null>(session, "picture", null);

    return ({ ...session, id, picture } as unknown) as SessionData;
  }

  return [getSessionData(), isLoading] as const;
}

function get<T>(target: Record<string, unknown> | null | void, key: string, defaultValue: T) {
  if (!target) return defaultValue;

  const existingValue = Reflect.get(target, key) as T;

  return existingValue ?? defaultValue;
}

export function useCurrentUser() {
  const [user, isLoading] = useAdjustedSession();

  return { loading: isLoading, user };
}

/**
 * User is pre-populated in _app.tsx file so if user is logged in, it'll never be loading with null user.
 *
 * Therefore in components that renders only on logged in use-cases, we can assert current user
 */
export function useAssertCurrentUser() {
  const { user } = useCurrentUser();

  assert(user, `Using useAssertCurrentUser with null user`);

  return user;
}
