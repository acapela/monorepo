import { useSession } from "next-auth/client";

function get<T>(target: Record<string, unknown> | null | void, key: string, defaultValue: T) {
  if (!target) return defaultValue;

  const existingValue = Reflect.get(target, key) as T;

  return existingValue ?? defaultValue;
}

export function useCurrentUser() {
  const [session, isLoading] = useSession();

  const userId = get<string | null>(session, "sub", null);
  const picture = get<string | null>(session, "picture", null);

  function getUser() {
    if (session) {
      return {
        ...session,
        id: userId,
        picture,
      };
    }

    return null;
  }

  return { loading: isLoading, user: getUser() };
}
