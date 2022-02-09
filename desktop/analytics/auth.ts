import { differenceInSeconds } from "date-fns";
import { autorun } from "mobx";

import { createLogger } from "@aca/shared/log";

import { authTokenBridgeValue } from "../bridge/auth";
import { UserEntity } from "../clientdb/user";
import { authStore } from "../store/auth";

const log = createLogger("Analytics - auth", false);

export function watchForUserAuthorized(callback: (user: UserEntity) => void) {
  return autorun(() => {
    const authorizedUser = authStore.user;
    const authStateChangeDate = authTokenBridgeValue.lastUpdateDate;

    log({ authorizedUser, authStateChangeDate });

    if (!authStateChangeDate || !authorizedUser) {
      return;
    }

    const diffInSecondsSinceAuthChange = differenceInSeconds(new Date(), authStateChangeDate);

    log({ diffInSecondsSinceAuthChange });
    if (diffInSecondsSinceAuthChange > 5) {
      return;
    }

    callback(authorizedUser);
  });
}
