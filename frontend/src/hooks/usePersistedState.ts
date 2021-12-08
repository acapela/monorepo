import { useCallback, useMemo, useState } from "react";

import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { useCurrentTeam } from "~frontend/team/CurrentTeam";
import { getHash } from "~shared/hash";
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";
import { createTimeout } from "~shared/time";

interface Input<S> {
  key?: string;
  initialValue: S;
  persistDebounce?: number;
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

function readLocalStorageJSON<S>(key: string) {
  const storedValue = localStorage.getItem(key);

  if (storedValue === null) {
    return null;
  }

  return JSON.parse(storedValue) as S;
}

function setLocalStorageJSON<S>(key: string, value: S) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function usePersistedState<S>({ key, initialValue, persistDebounce, isDetachedFromTeam }: Input<S>) {
  const teamBoundKey = key + useTeamMemberHash();
  const accessKey = isDetachedFromTeam ? key : teamBoundKey;

  function getInitialValue() {
    if (typeof localStorage === "undefined" || !accessKey) {
      return initialValue;
    }

    return readLocalStorageJSON<S>(accessKey) ?? initialValue;
  }

  const [value, setValue] = useState<S>(getInitialValue);

  const clear = useCallback(() => {
    if (!accessKey) return;

    localStorage.removeItem(accessKey);
  }, [accessKey]);

  useDependencyChangeEffect(() => {
    function persist() {
      if (!accessKey) return;
      setLocalStorageJSON(accessKey, value);
    }

    if (!persistDebounce) {
      persist();
      return;
    }

    return createTimeout(persist, persistDebounce);
  }, [value, accessKey, clear, initialValue, persistDebounce]);

  return [value, setValue, clear] as const;
}
