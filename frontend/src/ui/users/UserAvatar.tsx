import React from "react";
import styled from "styled-components";
import { UserBasicInfoFragment } from "~frontend/gql";
import { Avatar, AvatarSize } from "./Avatar";

interface Props {
  user: UserBasicInfoFragment;
  className?: string;
  size?: AvatarSize;
  disableNameTooltip?: boolean;
}

export const UserAvatar = styled(({ user, className, size = "regular", disableNameTooltip }: Props) => {
  return (
    <Avatar
      name={user.name}
      url={user.avatar_url}
      size={size}
      disableNameTooltip={disableNameTooltip}
      className={className}
    />
  );
})``;
