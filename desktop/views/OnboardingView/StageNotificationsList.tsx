import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { pickSnoozeTime } from "@aca/desktop/actions/snoozeUtils";
import { slackIntegrationClient } from "@aca/desktop/domains/integrations/slack";
import { getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";
import { useMethod } from "@aca/shared/hooks/useMethod";
import { getObjectKey } from "@aca/shared/object";
import { IconCheck, IconTime } from "@aca/ui/icons";
import { ShortcutDescriptor } from "@aca/ui/keyboard/ShortcutLabel";
import { useShortcut } from "@aca/ui/keyboard/useShortcut";

import { OnboardingNotificationRow } from "./list/Row";
import { OnboardingNotificationRowData } from "./list/types";
import { OnboardingStageProps } from "./stage";
import { UIOnboardingCard } from "./ui/cards";
import { OnboardingContinueButton } from "./ui/ContinueButton";
import { OnboardingAnimationItem } from "./ui/enterAnimations";
import { NeverDecreaseHeight } from "./ui/NeverDecreaseHeight";
import { OnboardingStageContainer, OnboardingStageSections } from "./ui/StageContainer";
import { OnboardingSecondaryHero } from "./ui/typo";

export const StageNotificationsList = observer(({ onContinue }: OnboardingStageProps) => {
  const handleSnoozeNotification = useMethod(async (notification: OnboardingNotificationRowData) => {
    await pickSnoozeTime();
    removeNotification(notification);
  });

  const removeNotification = useMethod(function removeNotification(notification: OnboardingNotificationRowData) {
    setNotifications((notifications) =>
      notifications.filter((existingNotification) => existingNotification !== notification)
    );
    selectNext();
  });

  const [notifications, setNotifications] = useState<OnboardingNotificationRowData[]>(() => {
    return [
      {
        integration: slackIntegrationClient,
        author: "Heiki",
        target: "#welcome",
        content: (
          <>
            Click <IconCheck /> or press <UIShortcut shortcut={"E"} /> to mark as done
          </>
        ),
        onResolve: removeNotification,
        onSnooze: handleSnoozeNotification,
      },
      {
        integration: slackIntegrationClient,
        author: "Heiki",
        target: "#welcome",
        content: (
          <>
            Click <IconTime /> or press <UIShortcut shortcut={"H"} /> to snooze
          </>
        ),
        onResolve: removeNotification,
        onSnooze: handleSnoozeNotification,
      },
      {
        integration: slackIntegrationClient,
        author: "Heiki",
        target: "#welcome",
        content: (
          <>
            Click notification or press <UIShortcut shortcut={"Enter"} /> to open
          </>
        ),
        onOpen: () => {
          onContinue();
        },
        onResolve: removeNotification,
        onSnooze: handleSnoozeNotification,
      },
    ];
  });

  useEffect(() => {
    if (!notifications.length) {
      onContinue();
    }
  }, [notifications.length]);

  const [selectedNotification, setSelectedNotification] = useState<OnboardingNotificationRowData | null>(
    notifications[0]
  );

  function selectNext() {
    if (!selectedNotification) {
      setSelectedNotification(notifications[0]);
      return;
    }

    const nextItem = getNextItemInArray(notifications, selectedNotification, { loop: false });

    if (!nextItem) return;

    setSelectedNotification(nextItem);
  }

  function selectPrevious() {
    if (!selectedNotification) {
      setSelectedNotification(notifications.at(-1)!);
      return;
    }
    const previousItem = getPreviousItemInArray(notifications, selectedNotification, { loop: false });

    if (!previousItem) return;

    setSelectedNotification(previousItem);
  }

  useShortcut("ArrowUp", selectPrevious);
  useShortcut("ArrowDown", selectNext);

  return (
    <OnboardingStageContainer>
      <OnboardingStageSections>
        <OnboardingSecondaryHero
          title="Notifications list"
          description="This is how synced notifications are presented to you. You can quickly snooze, resolve or open them."
        />
        <OnboardingAnimationItem>
          <UIOnboardingCard>
            <UINotifications>
              {notifications.map((notification) => {
                const isSelected = notification === selectedNotification;
                return (
                  <OnboardingNotificationRow
                    key={getObjectKey(notification)}
                    notification={notification}
                    isSelected={isSelected}
                    onSelectRequest={() => {
                      setSelectedNotification(notification);
                    }}
                    onDeselectRequest={() => {
                      if (!isSelected) return;
                      setSelectedNotification(null);
                    }}
                  />
                );
              })}
            </UINotifications>
          </UIOnboardingCard>
        </OnboardingAnimationItem>
        <OnboardingAnimationItem>
          <UITip>Tip: Press ↑↓ or hover mouse to select notifications</UITip>
        </OnboardingAnimationItem>

        <OnboardingContinueButton label="Continue" onClick={onContinue} />
      </OnboardingStageSections>
    </OnboardingStageContainer>
  );
});

/**
 * When you resolve notification, we dont want entire view to get shorter and flicker the layout.
 * Let's use NeverDecreaseHeight so it'll keep the height, even if empty
 */
const UINotifications = styled(NeverDecreaseHeight)`
  width: 640px;
`;

const UIShortcut = styled(ShortcutDescriptor)``;

const UITip = styled.div`
  font-weight: 500;
  font-size: 14px;
  opacity: 0.6;
`;
