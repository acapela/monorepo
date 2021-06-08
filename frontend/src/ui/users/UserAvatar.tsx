import React from "react";
import styled from "styled-components";
import { UserBasicInfoFragment } from "~frontend/gql";
import { Avatar } from "./Avatar";

interface Props {
  user: UserBasicInfoFragment;
  className?: string;
  size?: Size;
  disableNameTooltip?: boolean;
}

type Size = "regular" | "small";

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
