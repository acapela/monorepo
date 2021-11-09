import { useCallback, useMemo, useState } from "react";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useAssertCurrentTeam } from "~frontend/team/CurrentTeam";
import { getHash } from "~shared/hash";
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";
import { createTimeout } from "~shared/time";

interface Input<S> {
  key?: string;
  initialValue: S;
  persistDebounce?: number;
}

function useTeamMemberHash() {
  const currentUser = useAssertCurrentUser();
  const team = useAssertCurrentTeam();
  return useMemo(() => getHash(`${currentUser.id}$$${team.id}`), [currentUser, team]);
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

export function usePersistedState<S>({ key, initialValue, persistDebounce }: Input<S>) {
  const userBoundKey = key + useTeamMemberHash();

  function getInitialValue() {
    if (typeof localStorage === "undefined" || !userBoundKey) {
      return initialValue;
    }

    return readLocalStorageJSON<S>(userBoundKey) ?? initialValue;
  }

  const [value, setValue] = useState<S>(getInitialValue);

  const clear = useCallback(() => {
    if (!userBoundKey) return;

    localStorage.removeItem(userBoundKey);
  }, [userBoundKey]);

  useDependencyChangeEffect(() => {
    function persist() {
      if (!userBoundKey) return;
      setLocalStorageJSON(userBoundKey, value);
    }

    if (!persistDebounce) {
      persist();
      return;
    }

    return createTimeout(persist, persistDebounce);
  }, [value, userBoundKey, clear, initialValue, persistDebounce]);

  return [value, setValue, clear] as const;
}
