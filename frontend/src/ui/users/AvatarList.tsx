import React from "react";
import styled from "styled-components";
import { UserBasicInfoFragment } from "~frontend/gql";
import { Avatar } from "~frontend/ui/users/Avatar";

interface Props {
  users: UserBasicInfoFragment[];
  className?: string;
}

export const AvatarList = styled(function AvatarList({ users, className }: Props) {
  return (
    <UIHolder className={className}>
      {users.map((users, index) => (
        <Avatar size="small" key={index} url={users.avatar_url} name={users.name ?? ""} />
      ))}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  /* Hide overflow if has some */
  min-width: 0;
  mask-image: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 90%);

  &:hover {
    mask-image: none;
    z-index: 2;
    overflow: visible;
  }

  /* Shifts each child Avatar starting from the second one a bit to the left for them to overlap */

  ${Avatar} {
    box-sizing: content-box;
    margin-top: -2px;
    margin-bottom: -2px;
    border: 2px solid #fff;

    &:not(:first-child) {
      margin-left: -12px;
    }
  }
`;
