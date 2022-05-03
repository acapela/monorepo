import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { pickSnoozeTime } from "@aca/desktop/actions/snoozeUtils";
import { IntegrationIcon } from "@aca/desktop/domains/integrations/IntegrationIcon";
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

const sampleNotificationTitles = [
  "Heiki mentioned you in #welcome",
  "New message in #bugs",
  "New private message from @Roland",
  "3 new messages in #marketing",
  "2 new mentions in #standup",
  "Adam mentioned you in #product",
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

  const title = getItemFromArrayByIndexWithLoop(sampleNotificationTitles, fakeAppIndex);

  function refreshFakeApp(props?: FakeIntegrationScreenProps) {
    setFakeAppProps(props ?? {});
  }

  return (
    <GuideContext startDelay={750}>
      <OnboardingStageContainer>
        <OnboardingStageSections>
          <OnboardingSecondaryHero
            title="Focus mode"
            description="You can engage with the conversation by clicking on the full-screen application. Resolving or snoozing will load the next notification."
          />
          <OnboardingAnimationItem>
            <UIFakeApp>
              <FakeWindow
                topBar={
                  <UITopBar>
                    <UITopBarButtonsGroup>
                      <GuideItem
                        index={6}
                        content="Go back to list view"
                        onCompleted={async () => {
                          await wait(FAKE_APP_FADE_OUT_DURATION);
                          onContinue();
                        }}
                      >
                        {(complete) => {
                          return (
                            <TopBarButton
                              icon={<IconArrowLeft />}
                              tooltip="Go to list view"
                              onClick={() => {
                                complete();
                              }}
                            />
                          );
                        }}
                      </GuideItem>

                      <TopBarDivider />
                      <GuideItem index={4} content="Go to next notification without resolving it">
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
                      <GuideItem index={5} content="Go back to previous notification">
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
                          <IntegrationIcon integrationClient={slackIntegrationClient} />
                        </UITitleIcon>
                        {title}
                      </UITopbarTitle>
                    </AnimatePresence>

                    <UITopBarButtonsGroup>
                      <GuideItem index={1} content="Click to resolve notification">
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
                      <GuideItem index={2} content="Click to snooze notification">
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
                  <FakeIntegrationScreen {...fakeAppProps} key={getObjectKey(fakeAppProps)} />
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
