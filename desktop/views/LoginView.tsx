import React, { useEffect, useState } from "react";

import { loginToAcapelaWithGoogle, loginToAcapelaWithSlack } from "@aca/desktop/actions/auth";
import { autoLoginBridge, canAutoLoginBridge } from "@aca/desktop/bridge/auth";
import { ActionButton } from "@aca/desktop/ui/ActionButton";

import { FocusedActionView } from "./FocusedActionView";

export function LoginView() {
  const [canAutoLogin, setCanAutoLogin] = useState(false);
  useEffect(() => {
    canAutoLoginBridge().then(setCanAutoLogin);
  }, []);
  return (
    <FocusedActionView title="Sign into Acapela">
      {canAutoLogin && (
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
