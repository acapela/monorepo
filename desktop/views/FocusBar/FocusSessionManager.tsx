import { observer } from "mobx-react";
import React from "react";

import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { focusSessionStore } from "@aca/desktop/store/focus";

import { FocusBarWindow } from "./FocusBarWindow";

export const FocusSessionManager = observer(() => {
  const { useFocusBar } = applicationWideSettingsBridge.get();
  const session = focusSessionStore.session;

  if (!session || !useFocusBar) return null;

  return <FocusBarWindow session={session} />;
});
