import { apolloClient } from "@aca/desktop/apolloClient";
import { authStore } from "@aca/desktop/store/authStore";
import { assert } from "@aca/shared/assert";
import { asyncComputedWithCleanup } from "@aca/shared/mobxUtils";
import { wait } from "@aca/shared/time";

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
