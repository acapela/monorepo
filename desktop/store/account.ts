import { makeAutoObservable } from "mobx";

import { getNullableDb } from "@aca/desktop/clientdb";
import { assert } from "@aca/shared/assert";
import { devAssignWindowVariable } from "@aca/shared/dev";

import { teamEntity } from "../clientdb/team";
import { userEntity } from "../clientdb/user";
import { authStore } from "./auth";

/**
 * Store responsible for keeping information about current user and team.
 */

export const accountStore = makeAutoObservable({
  get user() {
    if (!authStore.userTokenData) return null;

    return getNullableDb()?.entity(userEntity).findById(authStore.userTokenData.id) ?? null;
  },
  get assertUser() {
    const user = accountStore.user;

    assert(user, "authStore.user is undefined. Consider using authStore.nullableUser");

    return user;
  },
  get team() {
    const db = getNullableDb();
    const { teamId } = authStore;

    if (!db || !teamId) return null;

    return db.entity(teamEntity).findById(teamId);
  },
  get assertTeam() {
    const team = accountStore.team;

    assert(team, "authStore.team is undefined. Consider using authStore.nullableTeam");

    return team;
  },
});

devAssignWindowVariable("accountStore", accountStore);
