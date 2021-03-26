import React, { useState } from "react";
import styled from "styled-components";
import { getInitials } from "@acapela/frontend/utils";

export interface AvatarProps {
  url?: string;
  className?: string;
  name: string;
}

const UIInnerShadow = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  border-radius: 9999px;

  --tw-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
`;

const PureAvatar: React.FC<AvatarProps> = ({ url, name, className }) => {
  const [failedToLoad, setFailedToLoad] = useState(false);

  if (!url || failedToLoad) {
    return (
      <div className={className}>
        <UIAvatarInner initials>
          <UIInitialsWrapper>{!!name && getInitials(name)}</UIInitialsWrapper>
        </UIAvatarInner>
      </div>
    );
  }

  return (
    <div className={className}>
      <UIAvatarInner>
        <img src={url} alt={`${name}'s avatar`} onError={() => setFailedToLoad(true)} />
        <UIInnerShadow />
      </UIAvatarInner>
    </div>
  );
};

export const Avatar = styled(PureAvatar)`
  width: 2.75rem;
  height: 2.75rem;
`;

const UIAvatarInner = styled.div<{ initials?: boolean }>`
  display: flex;
  justify-items: center;
  align-items: center;
  height: 100%;
  width: 100%;
  font-weight: 600;
  border-width: 2px;
  border-radius: 9999px;
  position: relative;

  img {
    position: absolute;
    border-radius: 9999px;
    object-fit: cover;
  }

  ${({ initials }) =>
    initials
      ? `
      --tw-bg-opacity: 1;
      background-color: rgba(96, 165, 250, var(--tw-bg-opacity));
      `
      : `
      --tw-border-opacity: 1;
      border-color: rgba(229, 231, 235, var(--tw-border-opacity));
  `}
`;

const UIInitialsWrapper = styled.span`
  width: 100%;
  text-align: center;
`;

const PureAvatarList: React.FC<{ avatars: AvatarProps[]; className?: string }> = ({ avatars, className }) => {
  return (
    <div className={className}>
      {avatars.map((avatar, index) => (
        <Avatar key={index} {...avatar} />
      ))}
    </div>
  );
};

export const AvatarList = styled(PureAvatarList)`
  display: flex;

  & > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    margin-right: calc(-0.75rem * var(--tw-space-x-reverse));
    margin-left: calc(-0.75rem * calc(1 - var(--tw-space-x-reverse)));
  }
`;
