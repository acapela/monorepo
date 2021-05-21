import React from "react";
import styled from "styled-components";
import { UserBasicInfoFragment } from "~frontend/gql";
import { Avatar } from "~frontend/ui/users/Avatar";
import { allowCssProp } from "~frontend/ui/styledCss";

interface Props {
  users: UserBasicInfoFragment[];
  className?: string;
}

const PureAvatarList = ({ users, className }: Props) => (
  <div className={className}>
    {users.map((users, index) => (
      <Avatar isSmall key={index} url={users.avatar_url} name={users.name ?? ""} />
    ))}
  </div>
);

export const AvatarList = styled(PureAvatarList)`
  display: flex;

  ${allowCssProp};

  /* Shifts each child Avatar starting from the second one a bit to the left for them to overlap */
  & > :not([hidden]) ~ :not([hidden]) {
    margin-left: -0.75rem;
  }
`;
