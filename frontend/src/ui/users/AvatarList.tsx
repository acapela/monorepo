import React from "react";
import styled from "styled-components";
import { UserBasicInfoFragment } from "~frontend/gql";
import { Avatar } from "~frontend/ui/users/Avatar";
import { allowCssProp } from "~frontend/ui/styledCss";

interface Props {
  users: UserBasicInfoFragment[];
  className?: string;
}

export const AvatarList = styled(function AvatarList({ users, className }: Props) {
  return (
    <UIHolder className={className}>
      {users.map((users, index) => (
        <Avatar isSmall key={index} url={users.avatar_url} name={users.name ?? ""} />
      ))}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;

  /* Shifts each child Avatar starting from the second one a bit to the left for them to overlap */
  & > :not([hidden]) ~ :not([hidden]) {
    margin-left: -0.75rem;
  }
`;
