import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { toggleMaximizeRequest } from "@aca/desktop/bridge/system";
import { desktopRouter } from "@aca/desktop/routes";
import { systemBarPlaceholder } from "@aca/desktop/ui/systemTopBar/ui";
import { theme } from "@aca/ui/theme";

import { StageConnectTools } from "./StageConnectTools";
import { OnboardingAnimationsOrchestrator } from "./ui/enterAnimations";

export const ConnectToolsView = observer(function OnboardingView() {
  return (
    <UIHolder>
      <UIWindowDragger
        onDoubleClick={() => {
          toggleMaximizeRequest();
        }}
      />
      <AnimatePresence exitBeforeEnter>
        <OnboardingAnimationsOrchestrator>
          <StageConnectTools
            onContinue={() => {
              desktopRouter.navigate("home");
            }}
            continueLabel="Open Acapela"
          />
        </OnboardingAnimationsOrchestrator>
      </AnimatePresence>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  ${theme.colors.layout.background.asBgWithReadableText}
`;

const UIWindowDragger = styled.div`
  ${systemBarPlaceholder};
  ${theme.common.dragWindow};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
`;
