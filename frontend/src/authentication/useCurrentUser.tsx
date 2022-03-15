import { useSession } from "next-auth/react";

import { UserTokenPayload } from "@aca/shared/jwt";

export function useCurrentUserTokenData(): UserTokenPayload | null {
  const { data } = useSession();
  return data as ReturnType<typeof useCurrentUserTokenData>;
}
