import React, { useState } from "react";
import styled from "styled-components";
import { Maybe } from "~frontend/gql";
import { getInitials } from "~frontend/utils";

export interface Props {
  name?: Maybe<string>;
  url?: string | null;
  className?: string;
  isSmall?: boolean;
}

const PureAvatar = ({ url, name, className }: Props) => {
  const [failedToLoad, setFailedToLoad] = useState(false);

  if (!url || failedToLoad) {
    return <div className={className}>{!!name && getInitials(name)}</div>;
  }

  return (
    <div className={className}>
      <img src={url} alt={`${name}'s avatar`} title={name ?? ""} onError={() => setFailedToLoad(true)} />
    </div>
  );
};

export const Avatar = styled(PureAvatar)`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${(props) => (props.isSmall ? 2 : 2.5)}rem;
  height: ${(props) => (props.isSmall ? 2 : 2.5)}rem;

  font-weight: 600;

  background-color: #ffaa70;

  border-radius: 50%;

  overflow: hidden;
`;
