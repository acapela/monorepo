import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { toggleFocusModeStats } from "@aca/desktop/actions/settings";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsGroup, getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { useConst } from "@aca/shared/hooks/useConst";
import { useGrowingArray } from "@aca/shared/hooks/useGrowingArray";
import { isNotFalsy } from "@aca/shared/nullish";
import { MINUTE } from "@aca/shared/time";
import { IconWatch2 } from "@aca/ui/icons";
import { describeShortcut } from "@aca/ui/keyboard/describeShortcut";
import { theme } from "@aca/ui/theme";

import { ProgressBar } from "./ProgressBar";

interface Props {
  currentNotification: NotificationEntity;
  list: NotificationsList;
}

interface Progress {
  done: number;
  all: number;
  percent: number;
}

interface GroupProgress extends Progress {
  group: NotificationsGroup | null;
}

function createProgress(done: number, all: number): Progress {
  return { done, all, percent: (done / all) * 100 };
}

const DEFAULT_AVG_TIME_PER_NOTIFICATION = MINUTE * 1.5;

export const FocusStats = observer(({ currentNotification, list }: Props) => {
  const focusModeStartedAt = useConst(() => new Date());
  const msSinceStarted = Math.max(1, Date.now() - focusModeStartedAt.getTime());
  /**
   * We never want to remove items from this list (eg. after you resolve some item and it is actually
   * not part of given list anymore).
   *
   * We however want to include new items if they appear in the list
   */
  const allNotificationsWhenFocusStarted = useGrowingArray(list.getAllNotifications());

  const groups = list.getGroups();

  const currentGroup =
    groups.filter(getIsNotificationsGroup).find((group) => group.notifications.includes(currentNotification)) ?? null;

  const notificationsResolvedSinceStart = allNotificationsWhenFocusStarted.filter((n) => n.isResolved);

  function getCurrentGroupProgressInfo(): GroupProgress {
    if (!currentGroup) {
      return { ...createProgress(0, 1), group: currentGroup };
    }

    const doneInGroup = currentGroup.notifications.filter((n) => n.isResolved);

    return { ...createProgress(doneInGroup.length, currentGroup.notifications.length), group: currentGroup };
  }

  function getAVGTimePerNotification() {
    if (notificationsResolvedSinceStart.length === 0) return DEFAULT_AVG_TIME_PER_NOTIFICATION;

    return msSinceStarted / notificationsResolvedSinceStart.length;
  }

  const avgTimePerNotification = getAVGTimePerNotification();

  const groupProgress = getCurrentGroupProgressInfo();

  const toggleDescription = toggleFocusModeStats.shortcut ? describeShortcut(toggleFocusModeStats.shortcut) : null;
  return (
    <UIHolder>
      <IconWatch2
        data-tooltip={[
          "Stats since you opened focus mode",
          toggleDescription ? `Press ${toggleDescription} to hide` : null,
        ]
          .filter(isNotFalsy)
          .join(". ")}
      />

      <ProgressBar
        all={allNotificationsWhenFocusStarted.length}
        done={notificationsResolvedSinceStart.length}
        title={list.name}
        avgTimePerItem={avgTimePerNotification}
      />
      <ProgressBar
        key={groupProgress.group?.id ?? currentNotification.id}
        all={groupProgress.all}
        done={groupProgress.done}
        title={groupProgress.group?.getMeta().title ?? "Current Notification"}
        // title="Current group"
        avgTimePerItem={avgTimePerNotification}
      />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  svg {
    ${theme.iconSize.item};
  }
`;
