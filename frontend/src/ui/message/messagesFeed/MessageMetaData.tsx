import { gql } from "@apollo/client";
import { ReactNode } from "react";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { MessageMetaData_UserFragment } from "~gql";
import { theme } from "~ui/theme";
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
  isMetaDataHidden: boolean;
  isHovered: boolean;
  date: Date;
  children: ReactNode;
}

export const MessageMetaData = withFragments(
  fragments,
  ({ user, date, children, isMetaDataHidden, isHovered }: Props) => {
    const canShowSideTimeLabel = isMetaDataHidden && isHovered;

    return (
      <UIHolder>
        {!isMetaDataHidden && <UserAvatar user={user} size="small" />}
        {!isMetaDataHidden && (
          <UIHead>
            {user.name || "Guest"} <UIHeaderTimeLabel date={date} />
          </UIHead>
        )}
        <div>{canShowSideTimeLabel && <UISideTimeLabel date={date} />}</div>
        {children}
      </UIHolder>
    );
  }
);

const UIHolder = styled.div<{}>`
  display: grid;

  grid-template-columns: 24px minmax(360px, 700px);
  gap: 8px 12px;
`;

const UIHead = styled.div<{}>`
  display: flex;
  align-items: center;
  gap: 8px;

  ${theme.font.body14.semibold.build()}
`;

const UIHeaderTimeLabel = styled(TimeLabelWithDateTooltip)<{}>`
  opacity: 0.4;
  user-select: none;
`;

const UISideTimeLabel = styled(TimeLabelWithDateTooltip)<{}>`
  ${theme.font.body12.build()};
  opacity: 0.4;
  user-select: none;
`;
