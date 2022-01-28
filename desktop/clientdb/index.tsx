import { useObserver } from "mobx-react";

import { assert } from "@aca/shared/assert";
import { asyncComputedWithCleanup } from "@aca/shared/mobxUtils";
import { wait } from "@aca/shared/time";

import { apolloClient } from "../apolloClient";
import { authStore } from "../store/authStore";
import { ClientDb, createNewClientDb } from "./createNewClientDb";

const clientDbValue = asyncComputedWithCleanup<ClientDb | null>(async ({ assertStillValid, setSelf }) => {
  const { nullableUser: user, teamId } = authStore;

  // Let's avoid re-creating clientdb in case data is rapidly changing
  await wait(50);

  assertStillValid();

  if (!user) return { value: null };

  const userId = user.id;

  const newDb = await createNewClientDb({
    userId,
    teamId: teamId,
    apolloClient: apolloClient,
    onDestroyRequest: () => {
      setSelf(null);
      newDb.destroy();
    },
  });

  assertStillValid(() => {
    newDb.destroy();
  });

  return {
    value: newDb,
    cleanup() {
      newDb.destroy();
    },
  };
});

export function getDb() {
  const db = getNullableDb();

  assert(db, "Used outside ClientDbProvider or without being logged in");

  return db;
}

export function getNullableDb() {
  return clientDbValue.value;
}

// TODO - I left hooks to avoid breaking the app - we don't need them now
export function useDb(): ClientDb {
  const db = useNullableDb();

  assert(db, "Used outside ClientDbProvider or without being logged in");

  return db;
}

// Used whenever we'd like to do checks without before knowing users's logging state
export function useNullableDb(): null | ClientDb {
  const db: ClientDb | null = useObserver(() => clientDbValue.value);

  return db;
}
