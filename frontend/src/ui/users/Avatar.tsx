import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Tooltip } from "~ui/popovers/Tooltip";
import { Maybe } from "~frontend/gql";
import { getInitials } from "~frontend/utils";

export interface Props {
  name?: Maybe<string>;
  url?: string | null;
  className?: string;
  isSmall?: boolean;
}

export const Avatar = styled(({ url, name, className, isSmall }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [failedToLoad, setFailedToLoad] = useState(false);

  if (!url || failedToLoad) {
    return <div className={className}>{!!name && getInitials(name)}</div>;
  }

  return (
    <>
      {name && <Tooltip label={name} anchorRef={ref} />}
      <UIHolder className={className} isSmall={isSmall} ref={ref}>
        <img src={url} alt={`${name}'s avatar`} title={name ?? ""} onError={() => setFailedToLoad(true)} />
      </UIHolder>
    </>
  );
})``;

const UIHolder = styled.div<{ isSmall?: boolean }>`
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
