import React, { useState } from "react";
import styled from "styled-components";

// TODO: how should this work in unit tests?
// import { getInitials } from "@acapela/frontend/utils";
import { getInitials } from "../utils";

export interface AvatarProps {
  url?: string;
  className?: string;
  name: string;
}

const UIAvatarInner = styled.div<{ initials?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100%;
  width: 100%;
  font-weight: 600;

  background-color: rgba(96, 165, 250, 1);

  border-width: 2px;
  border-style: solid;
  border-color: rgba(229, 231, 235, 1);
  border-radius: 50%;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);

  overflow: hidden;
`;

const PureAvatar: React.FC<AvatarProps> = ({ url, name, className }) => {
  const [failedToLoad, setFailedToLoad] = useState(false);

  if (!url || failedToLoad) {
    return (
      <div className={className}>
        <UIAvatarInner initials>{!!name && getInitials(name)}</UIAvatarInner>
      </div>
    );
  }

  return (
    <div className={className}>
      <UIAvatarInner>
        <img src={url} alt={`${name}'s avatar`} onError={() => setFailedToLoad(true)} />
      </UIAvatarInner>
    </div>
  );
};

export const Avatar = styled(PureAvatar)`
  width: 2.75rem;
  height: 2.75rem;
`;
