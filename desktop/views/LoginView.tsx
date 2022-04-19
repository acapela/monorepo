import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";

import { loginToAcapelaWithGoogle, loginToAcapelaWithSlack } from "@aca/desktop/actions/auth";
import { autoLoginBridge, canAutoLoginBridge } from "@aca/desktop/bridge/auth";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { Button } from "@aca/ui/buttons/Button";

import { Redirect } from "../routes";
import { accountStore } from "../store/account";
import { onboardingStore } from "../store/onboarding";
import { FocusedActionView } from "./FocusedActionView";

export const LoginView = observer(function LoginView() {
  const [canAutoLogin, setCanAutoLogin] = useState(false);
  useEffect(() => {
    canAutoLoginBridge().then(setCanAutoLogin);
  }, []);

  const user = accountStore.user;

  if (!user) {
    return (
      <FocusedActionView title="Sign into Acapela">
        {canAutoLogin && (
          <Button
            onClick={() => {
              autoLoginBridge();
            }}
          >
            AutoLogin
          </Button>
        )}
        <ActionButton action={loginToAcapelaWithGoogle} isWide />
        &nbsp;
        <ActionButton action={loginToAcapelaWithSlack} isWide />
      </FocusedActionView>
    );
  }

  if (user.isNew) {
    return <Redirect to="onboarding" />;
  }

  if (!onboardingStore.hasLinkedApps) {
    return <Redirect to="connect" />;
  }

  return <Redirect to="home" />;
});
