import React from "react";
import styled from "styled-components";

import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { FadePresenceAnimator } from "@aca/ui/animations";
import { theme } from "@aca/ui/theme";

interface Props {
  list: NotificationsList;
}

export function ZeroNotifications({ list }: Props) {
  return (
    <UIHolder>
      <UITitle>No notifications in this list.</UITitle>

      {!!list.listEntity && (
        <UIAdditionalInfo>
          Try to customize list filters to decide which items should end up in this list.{" "}
        </UIAdditionalInfo>
      )}
    </UIHolder>
  );
}

const UIHolder = styled(FadePresenceAnimator)`
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UITitle = styled.span`
  ${theme.typo.body.semibold.opacity(0.5)};
`;

const UIAdditionalInfo = styled.div`
  ${theme.typo.body.opacity(0.5)};
`;
