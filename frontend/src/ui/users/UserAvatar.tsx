import React from "react";

import { UserEntity } from "@aca/frontend/clientdb/user";
import { styledObserver } from "@aca/shared/component";

import { Avatar, AvatarSize } from "./Avatar";

interface Props {
  user: UserEntity;
  className?: string;
  size?: AvatarSize;
  disableNameTooltip?: boolean;
}

export const UserAvatar = styledObserver<Props>(({ user, className, size = "inherit", disableNameTooltip }) => (
  <Avatar
    name={user.name}
    url={user.avatar_url}
    size={size}
    disableNameTooltip={disableNameTooltip}
    className={className}
  />
))``;
