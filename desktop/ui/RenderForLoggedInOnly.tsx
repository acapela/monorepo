import { observer } from "mobx-react";
import React, { PropsWithChildren } from "react";

import { accountStore } from "../store/account";

export const RenderForLoggedInOnly = observer((props: PropsWithChildren<{}>) => {
  const user = accountStore.user;

  if (!user) return null;

  return <>{props.children}</>;
});
