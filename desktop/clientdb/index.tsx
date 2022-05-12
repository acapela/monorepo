import { autorun, computed } from "mobx";

import { apolloClient } from "@aca/desktop/apolloClient";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { authStore } from "@aca/desktop/store/auth";
import { assert } from "@aca/shared/assert";
import { devAssignWindowVariable } from "@aca/shared/dev";
import { asyncComputedWithCleanup } from "@aca/shared/mobx/utils";

import { reloadAppView } from "../bridge/system";
import { ClientDb, createNewClientDb } from "./createNewClientDb";

const clientDbValue = asyncComputedWithCleanup<ClientDb | null>(async ({ assertStillValid }) => {
  const userId = computed(() => authStore.userTokenData?.id).get();

  assertStillValid();

  if (!userId) return { value: null };

  async function handleDestroyRequest() {
    log.error("clientdb terminated - reloading the app");
    await reloadAppView();
  }

  const newDb = await createNewClientDb({
    userId,
    teamId: null,
    apolloClient: apolloClient,
    onDestroyRequest: handleDestroyRequest,
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
