import { useEffect } from "react";

import { useBoolean } from "@aca/shared/hooks/useBoolean";

import { getNullableDb } from "../clientdb";
import { ClientDb } from "../clientdb/createNewClientDb";
import { authStore } from "../store/auth";

type Callback = (db: ClientDb) => void;

export const useOnClientReadyEffect = (cb: Callback, options: { isLoginRequired: boolean }) => {
  const db = getNullableDb();
  const user = authStore.userTokenData;

  const [hasLoaded, { set: setHasLoaded }] = useBoolean(false);

  useEffect(() => {
    if (!hasLoaded && db && (options.isLoginRequired ? user : true)) {
      setHasLoaded();
      cb(db);
    }
  }, [db, user, options.isLoginRequired, hasLoaded]);
};
