import { gql } from "@apollo/client";
import { ReactNode } from "react";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { MessageMetaData_UserFragment } from "~gql";
import { fontSize } from "~ui/baseStyles";
import { TimeLabelWithDateTooltip } from "~ui/time/DateLabel";

const fragments = {
  user: gql`
    ${UserAvatar.fragments.user}

    fragment MessageMetaData_user on user {
      name
      ...UserAvatar_user
    }
  `,
};

interface Props {
  user: MessageMetaData_UserFragment;
  date: Date;
  children: ReactNode;
}

export const MessageMetaData = withFragments(fragments, ({ user, date, children }: Props) => (
  <UIHolder>
    <UserAvatar user={user} size="small" />
    <UIHead>
      {user.name || "Guest"} <TimeLabelWithDateTooltip date={date} />
    </UIHead>
    <div />
    {children}
  </UIHolder>
));

const UIHolder = styled.div<{}>`
  display: grid;
  align-items: center;
  grid-template-columns: auto minmax(360px, 700px);
  gap: 8px 12px;
`;

const UIHead = styled.div<{}>`
  font-weight: bold;
  font-size: ${fontSize.label};
  display: flex;
  gap: 8px;

  ${TimeLabelWithDateTooltip} {
    opacity: 0.4;
    user-select: none;
    font-weight: 400;
  }
`;
