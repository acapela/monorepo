import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";

import { getImplicitTargets } from "@aca/desktop/actions/action/context";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { getGuarded } from "@aca/shared/assert";
import { theme } from "@aca/ui/theme";

export function checkType<T>(input: unknown, checker: (input: T | null) => boolean): input is T {
  return checker(input as T | null);
}

export const DebugFocusView = observer(() => {
  const targets = getGuarded(() => getImplicitTargets(), []);
  return (
    <UIHolder>
      {targets.map((target, index) => {
        if (checkType<NotificationEntity>(target, (target) => target?.__typename === "notification")) {
          return <UITarget key={target.id}>[Notification] {getNotificationTitle(target)}</UITarget>;
        }

        if (checkType<NotificationsGroup>(target, (target) => target?.kind === "group")) {
          return <UITarget key={target.id}>[Group] {target.name}</UITarget>;
        }

        if (checkType<NotificationsList>(target, (target) => target?.kind === "notificationsList")) {
          return <UITarget key={target.id}>[List] {target.name}</UITarget>;
        }

        return <UITarget key={index}>[Unknown]</UITarget>;
      })}
    </UIHolder>
  );
});

const UIHolder = styled.div`
  ${theme.typo.label.semibold}
`;

const UITarget = styled.div`
  ${theme.common.ellipsisText}
`;
