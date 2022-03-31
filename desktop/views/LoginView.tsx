import React from "react";

import { loginToAcapelaWithGoogle, loginToAcapelaWithSlack } from "@aca/desktop/actions/auth";
import { autoLoginBridge } from "@aca/desktop/bridge/auth";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { IS_CI, IS_DEV } from "@aca/shared/dev";

import { FocusedActionView } from "./FocusedActionView";

export function LoginView() {
  return (
    <FocusedActionView title="Sign into Acapela">
      {(IS_DEV || IS_CI) && (
        <button
          onClick={() => {
            autoLoginBridge();
          }}
        >
          AutoLogin
        </button>
      )}
      <ActionButton action={loginToAcapelaWithGoogle} isWide />
      &nbsp;
      <ActionButton action={loginToAcapelaWithSlack} isWide />
    </FocusedActionView>
  );
}
