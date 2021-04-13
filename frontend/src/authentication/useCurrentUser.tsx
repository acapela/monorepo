import { useSession } from "next-auth/client";

export function useCurrentUser() {
  const [session, isLoading] = useSession();

  const userId: string | null = (Reflect.get(session ?? {}, "sub") as string) ?? null;

  function getUser() {
    if (session) {
      return {
        ...session,
        id: userId,
      };
    }

    return null;
  }

  return { loading: isLoading, user: getUser() };
}
