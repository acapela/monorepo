import { observer } from "mobx-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styled, { css } from "styled-components";

import { useDb } from "@aca/frontend/clientdb";
import { routes } from "@aca/shared/routes";
import { IconInboxIn } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

export const InboxLink = observer(() => {
  const router = useRouter();
  const db = useDb();
  const assignedRequestsCount = db.topic
    .query({ isClosed: false })
    .query((topic) => topic.selfAssignedOpenTasks.count > 0).count;
  return (
    <Link href={routes.home}>
      <UISidebarNavItem $isActive={router.pathname == routes.home}>
        <IconInboxIn style={{ width: 20, height: 20 }} /> <UIBold>Inbox</UIBold> {assignedRequestsCount}
      </UISidebarNavItem>
    </Link>
  );
});

const UISidebarNavItem = styled.div<{ $isActive: boolean }>`
  padding: 15px 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.actions.asGap};
  cursor: pointer;

  ${(props) =>
    props.$isActive &&
    css`
      ${theme.colors.layout.backgroundAccent.active.asBg};
    `}

  &:hover {
    ${theme.colors.layout.backgroundAccent.hover.asBg};
  }
`;

const UIBold = styled.span`
  ${theme.typo.content.semibold};
`;
