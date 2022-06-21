import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { defineAction } from "@aca/desktop/actions/action";
import { IntegrationIcon } from "@aca/desktop/domains/integrations/IntegrationIcon";
import { slackIntegrationClient } from "@aca/desktop/domains/integrations/slack";
import { runAction } from "@aca/desktop/domains/runAction";
import { TopBarButton } from "@aca/desktop/ui/systemTopBar/TopBarButton";
import { TopBarDivider, UITopBarButtonsGroup } from "@aca/desktop/ui/systemTopBar/ui";
import { wait } from "@aca/shared/time";
import { FadePresenceAnimator } from "@aca/ui/animations";
import { IconEdit, IconLightning } from "@aca/ui/icons";

import { FakeNotificationRows } from "./focus/FakeNotificationRows";
import { FakeWindow } from "./focus/FakeWindow";
import { GuideContext, GuideItem } from "./focus/Guide";
import { OnboardingStageProps } from "./stage";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingAnimationItem } from "./ui/enterAnimations";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingSecondaryHero } from "./ui/typo";

const FAKE_APP_FADE_OUT_DURATION = 350;

interface FakeComposeItemInput {
  label: string;
  icon: ReactNode;
}

const fakeComposeItems: FakeComposeItemInput[] = [
  { label: "Heiki", icon: <IntegrationIcon integrationClient={slackIntegrationClient} /> },
  { label: "Roland", icon: <IntegrationIcon integrationClient={slackIntegrationClient} /> },
  { label: "Omar", icon: <IntegrationIcon integrationClient={slackIntegrationClient} /> },
  { label: "Gregor", icon: <IntegrationIcon integrationClient={slackIntegrationClient} /> },
];

function createFakeComposeAction(onPicked: () => void) {
  return defineAction({
    name: "Compose",
    handler() {
      return {
        searchPlaceholder: "Write to...",
        getActions() {
          return fakeComposeItems.map((item) => {
            return defineAction({
              name: item.label,
              icon: item.icon,
              handler() {
                onPicked();
              },
            });
          });
        },
      };
    },
  });
}

export const StageCompose = observer(({ onContinue }: OnboardingStageProps) => {
  return (
    <GuideContext startDelay={750}>
      <OnboardingStageContainer>
        <OnboardingStageSections>
          <OnboardingSecondaryHero
            title="Composing Messages in Acapela"
            description="You can send messages in Slack without having to leave Acapela."
          />
          <OnboardingAnimationItem>
            <UIFakeApp>
              <FakeWindow
                topBar={
                  <UITopBar>
                    <UITopBarButtonsGroup>
                      <GuideItem
                        index={1}
                        content="Click to compose new message"
                        onCompleted={async () => {
                          await wait(FAKE_APP_FADE_OUT_DURATION);
                          onContinue();
                        }}
                      >
                        {(complete) => {
                          return (
                            <TopBarButton
                              icon={<IconEdit />}
                              tooltip="Compose..."
                              onClick={() => {
                                runAction(
                                  createFakeComposeAction(() => {
                                    complete();
                                  })
                                );
                                // complete();
                              }}
                            />
                          );
                        }}
                      </GuideItem>

                      <TopBarDivider />
                    </UITopBarButtonsGroup>
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
                  <FakeNotificationRows />
                </AnimatePresence>
              </FakeWindow>
            </UIFakeApp>
          </OnboardingAnimationItem>
          <OnboardingAnimationItem>
            <UITip>Tip: Click the icon with the Pencil located in the top left.</UITip>
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
  gap: 20px;
`;

const UITopbarTitle = styled(FadePresenceAnimator)`
  flex-grow: 1;
  font-weight: 500;
  display: flex;
  gap: 10px;
  align-items: center;
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
