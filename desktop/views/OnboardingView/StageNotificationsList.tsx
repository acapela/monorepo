import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { pickReminderTime } from "@aca/desktop/actions/remindersUtils";
import { figmaIntegrationClient } from "@aca/desktop/domains/integrations/figma";
import { notionIntegrationClient } from "@aca/desktop/domains/integrations/notion";
import { slackIntegrationClient } from "@aca/desktop/domains/integrations/slack";
import { getNotificationTag } from "@aca/desktop/domains/tag/tag";
import { getNextItemInArray, getPreviousItemInArray } from "@aca/shared/array";
import { useMethod } from "@aca/shared/hooks/useMethod";
import { getObjectKey } from "@aca/shared/object";
import { IconBell, IconCheck } from "@aca/ui/icons";
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
  const handleAddReminder = useMethod(async (notification: OnboardingNotificationRowData) => {
    await pickReminderTime();
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
        integration: notionIntegrationClient,
        author: "Adam",
        tags: [getNotificationTag("update")],
        content: (
          <>
            Click <IconCheck /> or press <UIShortcut shortcut={"E"} /> to mark as done
          </>
        ),
        timeAgoSent: "10m",
        onResolve: removeNotification,
        onAddReminder: handleAddReminder,
      },
      {
        integration: figmaIntegrationClient,
        author: "Nico",
        tags: [getNotificationTag("mention")],
        content: (
          <>
            Click <IconBell /> or press <UIShortcut shortcut={"H"} /> to add reminder
          </>
        ),
        onOpen: () => {
          onContinue();
        },
        timeAgoSent: "40m",
        onResolve: removeNotification,
        onAddReminder: handleAddReminder,
      },
      {
        integration: slackIntegrationClient,
        author: "Heiki",
        tags: [getNotificationTag("thread"), getNotificationTag({ category: "channel", customLabel: "#general" })],
        content: (
          <>
            Click notification or press <UIShortcut shortcut={"Enter"} /> to open
          </>
        ),
        timeAgoSent: "1hr",
        onResolve: removeNotification,
        onAddReminder: handleAddReminder,
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
          title="Your Inbox"
          description="All your notifications get captured in your Acapela inbox. You can quickly resolve, add reminder, or open them from here. Try it out!"
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
                    tags={notification.tags}
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
