import jwt from "jsonwebtoken";
import { makeAutoObservable } from "mobx";

import { authTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { getNullableDb } from "@aca/desktop/clientdb";
import { assert } from "@aca/shared/assert";
import { autorunEffect } from "@aca/shared/mobxUtils";

import { watchUserTeamId } from "./currentTeam";

/**
 * Store responsible for keeping information about current user and team.
 */

export const authStore = makeAutoObservable({
  get nullableUser() {
    const rawToken = authTokenBridgeValue.get();

    if (!rawToken) return null;

    // TODO: Type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return jwt.decode(rawToken) as Record<string, any>;
  },
  get user() {
    const user = authStore.nullableUser;

    assert(user, "authStore.user is undefined. Consider using authStore.nullableUser");

    return user;
  },
  teamId: null as string | null,
  get nullableTeam() {
    const db = getNullableDb();
    const { teamId } = authStore;

    if (!db || !teamId) return null;

    return db.team.findById(teamId);
  },
  get team() {
    const team = authStore.nullableTeam;

    assert(team, "authStore.team is undefined. Consider using authStore.nullableTeam");

    return team;
  },
});

autorunEffect(() => {
  const { nullableUser } = authStore;

  authStore.teamId = null;

  if (!nullableUser) {
    return;
  }

  return watchUserTeamId(nullableUser.id, (teamId) => {
    authStore.teamId = teamId;
  });
});
