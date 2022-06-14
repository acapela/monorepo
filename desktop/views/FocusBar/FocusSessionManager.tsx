import { observer } from "mobx-react";
import React from "react";

import { focusSessionStore } from "@aca/desktop/store/focus";

import { FocusBarWindow } from "./FocusBarWindow";

export const FocusSessionManager = observer(() => {
  const session = focusSessionStore.session;

  if (!session) return null;

  return <FocusBarWindow session={session} />;
});
