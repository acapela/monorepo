import { motion } from "framer-motion";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { loginToAcapelaWithGoogle, loginToAcapelaWithSlack } from "@aca/desktop/actions/auth";
import { autoLoginBridge, canAutoLoginBridge } from "@aca/desktop/bridge/auth";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { PopPresenceAnimator } from "@aca/ui/animations";
import { Button } from "@aca/ui/buttons/Button";
import { theme } from "@aca/ui/theme";

import { AppRedirect } from "../routes";
import { accountStore } from "../store/account";
import { onboardingStore } from "../store/onboarding";
import { Logo } from "../ui/Logo";

export const LoginView = observer(function LoginView() {
  const user = accountStore.user;

  if (!user) {
    return <LoginPanelView />;
  }

  if (!user.didFinishOnboarding) {
    return <AppRedirect to="onboarding" />;
  }

  if (!onboardingStore.hasLinkedApps) {
    return <AppRedirect to="connect" />;
  }

  return <AppRedirect to="home" />;
});

const LoginPanelView = observer(() => {
  const [canAutoLogin, setCanAutoLogin] = useState(false);
  const [shouldShowOtherMethods, setShouldShowOtherMethods] = useState(false);
  useEffect(() => {
    canAutoLoginBridge().then(setCanAutoLogin);
  }, []);

  return (
    <UIHolder>
      <UIBody>
        <UIHead layout="position">
          <UILogo />
          <UITitle>Log in to Acapela</UITitle>
        </UIHead>

        <UIMethods layout="position">
          <ActionButton size="primary" action={loginToAcapelaWithGoogle} isWide />

          {shouldShowOtherMethods && (
            <UIMethods>
              <ActionButton size="primary" action={loginToAcapelaWithSlack} isWide />
              {canAutoLogin && (
                <Button
                  isWide
                  size="primary"
                  onClick={() => {
                    autoLoginBridge();
                  }}
                >
                  Auto Login (dev)
                </Button>
              )}
            </UIMethods>
          )}

          {!shouldShowOtherMethods && (
            <Button
              kind="transparent"
              onClick={() => {
                setShouldShowOtherMethods(true);
              }}
            >
              Other login methods
            </Button>
          )}
        </UIMethods>
      </UIBody>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  ${theme.colors.layout.background.asBgWithReadableText};
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const UIBody = styled(PopPresenceAnimator)`
  max-width: 380px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 48px;
`;

const UIHead = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 24px;
  align-items: center;
`;

const UILogo = styled(Logo)`
  ${theme.iconSize.hero};
`;

const UITitle = styled.h1`
  ${theme.typo.pageTitle};
`;

const UIMethods = styled(PopPresenceAnimator)`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  gap: 10px;
`;
