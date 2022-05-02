import { autorun, computed } from "mobx";

import { apolloClient } from "@aca/desktop/apolloClient";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { authStore } from "@aca/desktop/store/auth";
import { assert } from "@aca/shared/assert";
import { devAssignWindowVariable } from "@aca/shared/dev";
import { asyncComputedWithCleanup } from "@aca/shared/mobx/utils";
import { wait } from "@aca/shared/time";

import { ClientDb, createNewClientDb } from "./createNewClientDb";

const clientDbValue = asyncComputedWithCleanup<ClientDb | null>(async ({ assertStillValid, setSelf }) => {
  const userId = computed(() => authStore.userTokenData?.id).get();
  const teamId = computed(() => authStore.teamId).get();

  // Let's avoid re-creating clientdb in case data is rapidly changing
  await wait(50);

  assertStillValid();

  if (!userId) return { value: null };
  if (teamId === false) return { value: null };

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

const log = makeLogger("ClientDb");

export function getDb() {
  const db = getNullableDb();

  assert(db, "Used outside ClientDbProvider or without being logged in", log.error);

  return db;
}

export function getNullableDb() {
  const db = clientDbValue.value;

  return db;
}

autorun(() => {
  devAssignWindowVariable("db", getNullableDb());
});
