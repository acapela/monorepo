import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { getSystemList } from "@aca/desktop/domains/list/system";
import { ListFiltersEditor } from "@aca/desktop/ui/Filters";
import { FadePresenceAnimator } from "@aca/ui/animations";
import { IconLightning } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import { FakeRows } from "./focus/fakeContent";
import { FakeWindow } from "./focus/FakeWindow";
import { GuideContext } from "./focus/Guide";
import { OnboardingStageProps } from "./stage";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingAnimationItem } from "./ui/enterAnimations";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingTip } from "./ui/Tip";
import { OnboardingSecondaryHero } from "./ui/typo";

export const StageImportantFilters = observer(({ onContinue }: OnboardingStageProps) => {
  const importantList = getSystemList("important");

  return (
    <GuideContext startDelay={750}>
      <OnboardingStageContainer>
        <OnboardingStageSections>
          <OnboardingSecondaryHero
            title="Start organising your inbox"
            description="Define custom rules for each tool and add them to your Important list."
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
            <OnboardingTip>Click an Application Button to define specific rules.</OnboardingTip>
          </OnboardingAnimationItem>

          <OnboardingContinueButton label="Continue" onClick={onContinue} />
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
  ${theme.iconSize.item};
`;

const UIEditor = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;

  gap: 32px;
`;
