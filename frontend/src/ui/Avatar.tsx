import React, { useState } from "react";
import styled from "styled-components";
import { getInitials } from "~frontend/utils";

export interface AvatarProps {
  name?: string;
  url?: string | null;
  className?: string;
}

const PureAvatar: React.FC<AvatarProps> = ({ url, name, className }) => {
  const [failedToLoad, setFailedToLoad] = useState(false);

  if (!url || failedToLoad) {
    return <div className={className}>{!!name && getInitials(name)}</div>;
  }

  return (
    <div className={className}>
      <img src={url} alt={`${name}'s avatar`} title={name} onError={() => setFailedToLoad(true)} />
    </div>
  );
};

export const Avatar = styled(PureAvatar)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.75rem;
  height: 2.75rem;

  font-weight: 600;

  background-color: #ffaa70;

  border-radius: 50%;

  overflow: hidden;
`;
