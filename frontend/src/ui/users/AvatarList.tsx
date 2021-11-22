import React from "react";
import { useRef } from "react";
import styled from "styled-components";

import { UserEntity } from "~frontend/clientdb/user";
import { Avatar, AvatarSize } from "~frontend/ui/users/Avatar";
import { styledObserver } from "~shared/component";
import { groupByFilter } from "~shared/groupByFilter";
import { formatNumberWithMaxValue } from "~shared/numbers";
import { CircleLabel } from "~ui/icons/CircleLabel";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";
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
  size = "inherit",
}: Props) {
  const [visibleAvatars, avatarsInPopover] = groupByFilter(users, (user, index) => index < maxVisibleCount);
  const holderRef = useRef<HTMLDivElement>(null);

  const popoverOptions: PopoverMenuOption[] = avatarsInPopover.map((user) => {
    return {
      key: user.id,
      label: user.name ?? "",
      icon: <UserAvatar size={size} user={user} />,
      onSelect: () => ({}),
    };
  });

  return (
    <UIHolder ref={holderRef} className={className} aria-label="topic members">
      {visibleAvatars.map((user) => (
        <UserAvatar size={size} key={user.id} user={user} />
      ))}
      {avatarsInPopover.length > 0 && (
        <PopoverMenuTrigger options={popoverOptions}>
          <CircleLabel label={formatNumberWithMaxValue(avatarsInPopover.length, 9, true)} />
        </PopoverMenuTrigger>
      )}
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  display: flex;
  min-width: 0;
  font-size: 24px;

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
