import { gql } from "@apollo/client";
import React from "react";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { UserAvatar_UserFragment } from "~gql";

import { Avatar, AvatarSize } from "./Avatar";

interface Props {
  user: UserAvatar_UserFragment;
  className?: string;
  size?: AvatarSize;
  disableNameTooltip?: boolean;
}

export const UserAvatar = withFragments(
  {
    user: gql`
      fragment UserAvatar_user on user {
        name
        avatar_url
      }
    `,
  },
  styled<Props>(({ user, className, size = "regular", disableNameTooltip }) => (
    <Avatar
      name={user.name}
      url={user.avatar_url}
      size={size}
      disableNameTooltip={disableNameTooltip}
      className={className}
    />
  ))``
);
