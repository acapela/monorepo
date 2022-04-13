import jwt from "jsonwebtoken";
import { action, makeAutoObservable } from "mobx";

import { authTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { assert } from "@aca/shared/assert";
import { devAssignWindowVariable } from "@aca/shared/dev";
import { autorunEffect } from "@aca/shared/mobx/utils";

import { watchUserTeamId } from "./currentTeam";

/**
 * Store responsible for keeping information about current user JWT token and team id.
 *
 * Important! This store should not manage 'clientdb' user/team connection in any way.
 * This is because ClientDB is reading from this store so it'd create circular dependency.
 *
 * User (clientdb) is managed in accountStore
 */

export const authStore = makeAutoObservable({
  get userTokenData() {
    const rawToken = authTokenBridgeValue.value;

    if (!rawToken) return null;

    // TODO: Type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return jwt.decode(rawToken) as Record<string, any>;
  },
  get assertUserTokenData() {
    const user = authStore.userTokenData;

    assert(user, "authStore.user is undefined. Consider using authStore.nullableUser");

    return user;
  },
  // False indicates not-ready
  teamId: false as false | string | null,
});

autorunEffect(() => {
  const { userTokenData } = authStore;

  if (!userTokenData) {
    return;
  }

  return watchUserTeamId(
    userTokenData.id,
    action((teamId) => {
      authStore.teamId = teamId;
    })
  );
});

devAssignWindowVariable("authStore", authStore);
devAssignWindowVariable("authTokenBridgeValue", authTokenBridgeValue);
