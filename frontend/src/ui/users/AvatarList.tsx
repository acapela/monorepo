import React from "react";
import styled from "styled-components";
import { UserBasicInfoFragment } from "~gql";
import { Avatar } from "~frontend/ui/users/Avatar";
import { groupByFilter } from "~shared/groupByFilter";
import { useRef } from "react";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { UserAvatar } from "./UserAvatar";
import { CircleLabel } from "~ui/icons/CircleLabel";
import { formatNumberWithMaxCallback } from "~shared/numbers";

interface Props {
  users: UserBasicInfoFragment[];
  maxVisibleCount?: number;
  className?: string;
}

export const AvatarList = styled(function AvatarList({ users, className, maxVisibleCount = 3 }: Props) {
  const [visibleAvatars, avatarsInPopover] = groupByFilter(users, (user, index) => index < maxVisibleCount);
  const holderRef = useRef<HTMLDivElement>(null);

  return (
    <UIHolder ref={holderRef} className={className}>
      {visibleAvatars.map((user) => (
        <UserAvatar size="small" key={user.id} user={user} />
      ))}
      {avatarsInPopover.length > 0 && (
        <PopoverMenuTrigger
          options={avatarsInPopover.map((user) => {
            return {
              label: user.name ?? "",
              icon: <UserAvatar size="small" user={user} />,
            };
          })}
        >
          <CircleLabel label={formatNumberWithMaxCallback(avatarsInPopover.length, 9, true)} />
        </PopoverMenuTrigger>
      )}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
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
