/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";

import { USERSNAP_GLOBAL_API_KEY } from "@aca/desktop/lib/env";

export const UsersnapContext = React.createContext<any>(null);

export const UsersnapProvider = ({
  initParams = {},
  children,
}: {
  initParams: { user: { userId: string; email: string } } | {};
  children: any;
}) => {
  const [usersnapApi, setUsersnapApi] = useState(null);
  useEffect(() => {
    let usersnapApi: any = null;
    window.onUsersnapCXLoad = function (api) {
      api.init(initParams);
      usersnapApi = api;
      setUsersnapApi(api);
    };
    const script = document.createElement("script");
    script.defer = true;
    script.src = `https://widget.usersnap.com/global/load/${USERSNAP_GLOBAL_API_KEY}?onload=onUsersnapCXLoad`;
    document.head.appendChild(script);
    return () => {
      if (usersnapApi) {
        usersnapApi.destroy();
      }
      script.remove();
    };
  }, []);

  return <UsersnapContext.Provider value={usersnapApi}>{children}</UsersnapContext.Provider>;
};

export function useUsersnapApi() {
  return useContext(UsersnapContext);
}
