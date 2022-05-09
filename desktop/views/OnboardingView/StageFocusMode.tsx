import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { pickSnoozeTime } from "@aca/desktop/actions/snoozeUtils";
import { asanaIntegrationClient } from "@aca/desktop/domains/integrations/asana";
import { googleDriveIntegrationClient } from "@aca/desktop/domains/integrations/drive";
import { figmaIntegrationClient } from "@aca/desktop/domains/integrations/figma";
import { IntegrationIcon } from "@aca/desktop/domains/integrations/IntegrationIcon";
import { linearIntegrationClient } from "@aca/desktop/domains/integrations/linear";
import { notionIntegrationClient } from "@aca/desktop/domains/integrations/notion";
import { slackIntegrationClient } from "@aca/desktop/domains/integrations/slack";
import { TopBarButton } from "@aca/desktop/ui/systemTopBar/TopBarButton";
import { TopBarDivider, UITopBarButtonsGroup } from "@aca/desktop/ui/systemTopBar/ui";
import { useThrottledState } from "@aca/shared/hooks/useDebouncedState";
import { getObjectKey } from "@aca/shared/object";
import { wait } from "@aca/shared/time";
import { FadePresenceAnimator } from "@aca/ui/animations";
import { IconArrowBottom, IconArrowLeft, IconArrowTop, IconCheck, IconTime } from "@aca/ui/icons";

import { FakeIntegrationScreen, FakeIntegrationScreenProps } from "./focus/FakeIntegrationScreen";
import { FakeWindow } from "./focus/FakeWindow";
import { GuideContext, GuideItem } from "./focus/Guide";
import { OnboardingStageProps } from "./stage";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingAnimationItem } from "./ui/enterAnimations";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingSecondaryHero } from "./ui/typo";

const sampleNotificationContent = [
  { title: "Heiki mentioned you in #welcome", integrationClient: slackIntegrationClient },
  { title: "3 new comments in New Settings Page", integrationClient: figmaIntegrationClient },
  { title: "1 new comment in Q3 Product Roadmap", integrationClient: notionIntegrationClient },
  { title: "2 new updates in Onboarding Felix", integrationClient: asanaIntegrationClient },
  { title: "4 new comments in New Onboarding Flow", integrationClient: linearIntegrationClient },
  { title: "Jannick commented in Q3 budget", integrationClient: googleDriveIntegrationClient },
];

const FAKE_APP_FADE_OUT_DURATION = 350;

/**
 * getItemFromArrayByIndexWithLoop([1,2,3,4,5], 12) -> 3
 */
function getItemFromArrayByIndexWithLoop<T>(items: T[], index: number) {
  return items[index % items.length];
}

function useChangesCount(input: unknown) {
  const lastRef = useRef(input);
  const countRef = useRef(0);

  if (lastRef.current !== input) {
    countRef.current++;
  }

  lastRef.current = input;

  return countRef.current;
}

export const StageFocusMode = observer(({ onContinue }: OnboardingStageProps) => {
  // Avoid stagger animations long delay if user clicks next too many times quickly
  const [fakeAppProps, setFakeAppProps] = useThrottledState<FakeIntegrationScreenProps>({}, 500);
  // We'll use it to get 'next' example title (we use index instead of random to avoid showing the same title twice and have some control on order of showing titles)
  const fakeAppIndex = useChangesCount(fakeAppProps);

  const { title, integrationClient } = getItemFromArrayByIndexWithLoop(sampleNotificationContent, fakeAppIndex);

  function refreshFakeApp(props?: FakeIntegrationScreenProps) {
    setFakeAppProps(props ?? {});
  }

  return (
    <GuideContext startDelay={750}>
      <OnboardingStageContainer>
        <OnboardingStageSections>
          <OnboardingSecondaryHero
            title="Action your notifications"
            description="When you open a notification, that app gets loaded full screen in Acapela. You can use Focus Mode to reply directly, or snooze and resolve it to move onto the next one. Try it out!"
          />
          <OnboardingAnimationItem>
            <UIFakeApp>
              <FakeWindow
                topBar={
                  <UITopBar>
                    <UITopBarButtonsGroup>
                      <GuideItem
                        index={6}
                        content="Go back to your inbox"
                        onCompleted={async () => {
                          await wait(FAKE_APP_FADE_OUT_DURATION);
                          onContinue();
                        }}
                      >
                        {(complete) => {
                          return (
                            <TopBarButton
                              icon={<IconArrowLeft />}
                              tooltip="Go back to list view"
                              onClick={() => {
                                complete();
                              }}
                            />
                          );
                        }}
                      </GuideItem>

                      <TopBarDivider />
                      <GuideItem index={4} content="Jump to the next notification">
                        {(complete) => {
                          return (
                            <TopBarButton
                              icon={<IconArrowBottom />}
                              tooltip="Go to next notification"
                              onClick={() => {
                                complete();
                                refreshFakeApp();
                              }}
                            />
                          );
                        }}
                      </GuideItem>
                      <GuideItem index={5} content="Go back to the previous notification">
                        {(complete) => {
                          return (
                            <TopBarButton
                              icon={<IconArrowTop />}
                              tooltip="Go to previous notification"
                              onClick={() => {
                                complete();
                                refreshFakeApp();
                              }}
                            />
                          );
                        }}
                      </GuideItem>
                    </UITopBarButtonsGroup>
                    <AnimatePresence exitBeforeEnter>
                      <UITopbarTitle key={title}>
                        <UITitleIcon>
                          <IntegrationIcon integrationClient={integrationClient} />
                        </UITitleIcon>
                        {title}
                      </UITopbarTitle>
                    </AnimatePresence>

                    <UITopBarButtonsGroup>
                      <GuideItem index={1} content="Click to resolve the notification">
                        {(complete) => {
                          return (
                            <TopBarButton
                              icon={<IconCheck />}
                              tooltip="Resolve notification"
                              onClick={() => {
                                complete();
                                refreshFakeApp();
                              }}
                            />
                          );
                        }}
                      </GuideItem>
                      <GuideItem index={2} content="Click to snooze it">
                        {(complete) => {
                          return (
                            <TopBarButton
                              icon={<IconTime />}
                              tooltip="Snooze notification..."
                              onClick={async () => {
                                await pickSnoozeTime();
                                complete();
                                refreshFakeApp({
                                  onSent() {
                                    refreshFakeApp();
                                  },
                                });
                              }}
                            />
                          );
                        }}
                      </GuideItem>
                    </UITopBarButtonsGroup>
                  </UITopBar>
                }
              >
                <AnimatePresence exitBeforeEnter>
                  <FakeIntegrationScreen {...{ integrationClient }} key={getObjectKey(fakeAppProps)} />
                </AnimatePresence>
              </FakeWindow>
            </UIFakeApp>
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
