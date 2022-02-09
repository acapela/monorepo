import { differenceInSeconds } from "date-fns";
import { autorun } from "mobx";

import { authTokenBridgeValue } from "@aca/desktop/bridge/auth";
import { UserEntity } from "@aca/desktop/clientdb/user";
import { accountStore } from "@aca/desktop/store/account";
import { createLogger } from "@aca/shared/log";

const log = createLogger("Analytics - auth", false);

export function watchForUserAuthorized(callback: (user: UserEntity) => void) {
  return autorun(() => {
    const authorizedUser = accountStore.user;
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
