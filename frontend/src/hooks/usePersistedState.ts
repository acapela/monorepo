import { useMemo } from "react";

import { useCurrentUserTokenData } from "@aca/frontend/authentication/useCurrentUser";
import { useCurrentTeam } from "@aca/frontend/team/CurrentTeam";
import { getHash } from "@aca/shared/hash";
import { getLocalStorageValueManager } from "@aca/shared/localStorage";

interface Input<S> {
  key?: string;
  initialValue: S;
  isDetachedFromTeam?: boolean;
}

function useTeamMemberHash() {
  const user = useCurrentUserTokenData();
  const team = useCurrentTeam();

  return useMemo(() => {
    if (!user || !team) {
      return "";
    }

    return getHash(`${user.id}$$${team.id}`);
  }, [user, team]);
}

export function usePersistedState<S>({ key, initialValue, isDetachedFromTeam }: Input<S>) {
  const teamBoundKey = key + useTeamMemberHash();
  const accessKey = isDetachedFromTeam ? key : teamBoundKey;

  const valueManager = getLocalStorageValueManager<S>(accessKey ?? null, initialValue);

  const currentValue = valueManager.useValue();

  return [currentValue, valueManager.set, valueManager.clear] as const;
}
