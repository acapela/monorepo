import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { UserEntity } from "~frontend/clientdb/user";

import { Avatar, AvatarSize } from "./Avatar";

interface Props {
  user: UserEntity;
  className?: string;
  size?: AvatarSize;
  disableNameTooltip?: boolean;
}

export const UserAvatar = styled<Props>(
  observer(({ user, className, size = "regular", disableNameTooltip }) => (
    <Avatar
      name={user.name}
      url={user.avatar_url}
      size={size}
      disableNameTooltip={disableNameTooltip}
      className={className}
    />
  ))
)``;
