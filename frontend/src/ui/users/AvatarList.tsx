import React, { useRef } from "react";
import styled from "styled-components";

import { styledObserver } from "~frontend/../../shared/component";
import { UserEntity } from "~frontend/clientdb/user";
import { Avatar, AvatarSize } from "~frontend/ui/users/Avatar";
import { groupByFilter } from "~shared/groupByFilter";
import { formatNumberWithMaxValue } from "~shared/numbers";
import { CircleLabel } from "~ui/icons/CircleLabel";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

import { UserAvatar } from "./UserAvatar";

interface Props {
  users: UserEntity[];
  maxVisibleCount?: number;
  className?: string;
  size?: AvatarSize;
}

export const AvatarList = styledObserver(function AvatarList({
  users,
  className,
  maxVisibleCount = 3,
  size = "small",
}: Props) {
  const [visibleAvatars, avatarsInPopover] = groupByFilter(users, (user, index) => index < maxVisibleCount);
  const holderRef = useRef<HTMLDivElement>(null);

  return (
    <UIHolder ref={holderRef} className={className}>
      {visibleAvatars.map((user) => (
        <UserAvatar size={size} key={user.id} user={user} />
      ))}
      {avatarsInPopover.length > 0 && (
        <PopoverMenuTrigger
          options={avatarsInPopover.map((user) => {
            return {
              label: user.name ?? "",
              icon: <UserAvatar size={size} user={user} />,
            };
          })}
        >
          <CircleLabel label={formatNumberWithMaxValue(avatarsInPopover.length, 9, true)} />
        </PopoverMenuTrigger>
      )}
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  display: flex;
  min-width: 0;

  ${Avatar}, ${CircleLabel} {
    box-sizing: content-box;

    /* Shifts each child Avatar starting from the second one a bit to the left for them to overlap */
    margin-top: -2px;
    margin-bottom: -2px;
    border: 2px solid #fff;
    margin-left: -12px;
  }

  ${CircleLabel} {
    cursor: pointer;
  }

  ${Avatar} {
    &:first-child {
      margin-left: 0;
    }
  }
`;
