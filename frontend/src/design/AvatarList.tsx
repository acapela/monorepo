import React from "react";
import styled from "styled-components";
import { Avatar, AvatarProps } from "@acapela/frontend/design/Avatar";

interface AvatarListProps {
  avatars: AvatarProps[];
  className?: string;
}

const PureAvatarList: React.FC<AvatarListProps> = ({ avatars, className }) => (
  <div className={className}>
    {avatars.map((avatar, index) => (
      <Avatar key={index} {...avatar} />
    ))}
  </div>
);

export const AvatarList = styled(PureAvatarList)`
  display: flex;

  /* Shifts each child Avatar starting from the second one a bit to the left for them to overlap */
  & > :not([hidden]) ~ :not([hidden]) {
    margin-left: -0.75rem;
  }
`;
