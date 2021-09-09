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
  date: Date;
  children: ReactNode;
  className?: string;
  isHidden?: boolean;
  isHovered?: boolean;
}

export const MessageMetaDataWrapper = withFragments(
  fragments,
  styled(({ user, date, children, isHidden = false, isHovered = false, className }: Props) => {
    const canShowSideTimeLabel = isHidden && isHovered;

    return (
      <UIHolder className={className}>
        {!isHidden && (
          <>
            <UserAvatar user={user} size="small" />{" "}
            <UIHead>
              {user.name || "Guest"} <UIHeaderTimeLabel date={date} />
            </UIHead>
          </>
        )}
        <div>{canShowSideTimeLabel && <UISideTimeLabel date={date} />}</div>
        {children}
      </UIHolder>
    );
  })``
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
  ${theme.font.body12.withExceptionalLineHeight("1", "Prevents adding space when content only has one line").build()};
  opacity: 0.4;
  user-select: none;
`;
