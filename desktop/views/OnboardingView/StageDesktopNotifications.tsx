import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { getSystemList } from "@aca/desktop/domains/list/system";
import { ListFiltersEditor } from "@aca/desktop/ui/Filters";
import { wait } from "@aca/shared/time";
import { FadePresenceAnimator } from "@aca/ui/animations";
import { IconLightning } from "@aca/ui/icons";

import { ListNotificationsSettings } from "../ListView/Topbar/NotificationsSettings";
import { FakeRows } from "./focus/fakeContent";
import { FakeWindow } from "./focus/FakeWindow";
import { GuideContext, GuideItem } from "./focus/Guide";
import { OnboardingStageProps } from "./stage";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingAnimationItem } from "./ui/enterAnimations";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingSecondaryHero } from "./ui/typo";

const FAKE_APP_FADE_OUT_DURATION = 350;

export const StageDesktopNotifications = observer(({ onContinue }: OnboardingStageProps) => {
  const importantList = getSystemList("important");

  return (
    <GuideContext startDelay={750}>
      <OnboardingStageContainer>
        <OnboardingStageSections>
          <OnboardingSecondaryHero
            title="Enable Desktop Notifications"
            description="Desktop notifications can be toggled for every list independently."
          />
          <OnboardingAnimationItem>
            <UIFakeApp>
              <FakeWindow
                topBar={
                  <UITopBar>
                    <AnimatePresence exitBeforeEnter>
                      <UITopbarTitle>
                        <UITitleIcon>
                          <IconLightning />
                        </UITitleIcon>
                        Important
                      </UITopbarTitle>
                      <GuideItem
                        index={1}
                        content="Click to customize desktop notifications"
                        onCompleted={async () => {
                          await wait(FAKE_APP_FADE_OUT_DURATION);
                          onContinue();
                        }}
                        hideTipOnAction
                      >
                        {() => {
                          return <ListNotificationsSettings list={importantList!} />;
                        }}
                      </GuideItem>
                    </AnimatePresence>
                  </UITopBar>
                }
              >
                <AnimatePresence exitBeforeEnter>
                  <UIEditor>
                    {importantList && <ListFiltersEditor list={importantList} />}
                    <FakeRows />
                  </UIEditor>
                </AnimatePresence>
              </FakeWindow>
            </UIFakeApp>
          </OnboardingAnimationItem>
          <OnboardingAnimationItem>
            <UITip>Tip: Click an Application Button to define specific rules.</UITip>
          </OnboardingAnimationItem>

          <OnboardingContinueButton label="Launch Acapela" onClick={onContinue} />
        </OnboardingStageSections>
      </OnboardingStageContainer>
    </GuideContext>
  );
});

const UITopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  gap: 20px;
`;

const UITopbarTitle = styled(FadePresenceAnimator)`
  flex-grow: 1;
  font-weight: 500;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;

const UIFakeApp = styled.div`
  width: 720px;
`;

const UITitleIcon = styled.div`
  font-size: 20px;
`;

const UITip = styled.div`
  font-weight: 500;
  font-size: 14px;
  opacity: 0.6;
`;

const UIEditor = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;

  gap: 32px;
`;
