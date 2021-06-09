import React, { useState } from "react";
import styled from "styled-components";
import { Maybe } from "~frontend/gql";
import { getInitials } from "~frontend/utils";

export interface Props {
  name?: Maybe<string>;
  url?: string | null;
  className?: string;
  size?: Size;
  disableNameTooltip?: boolean;
}

type Size = "regular" | "small";

export const Avatar = styled(({ url, name, className, size = "regular", disableNameTooltip }: Props) => {
  const [failedToLoad, setFailedToLoad] = useState(false);

  if (!url || failedToLoad) {
    return (
      <UIHolder size={size} className={className}>
        {!!name && getInitials(name)}
      </UIHolder>
    );
  }

  return (
    <>
      <UIHolder data-tooltip={!disableNameTooltip && name} className={className} size={size}>
        <img src={url} alt={`${name}'s avatar`} title={name ?? ""} onError={() => setFailedToLoad(true)} />
      </UIHolder>
    </>
  );
})``;

const UIHolder = styled.div<{ size: Size }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${(props) => getAvatarRemSize(props.size)}rem;
  height: ${(props) => getAvatarRemSize(props.size)}rem;

  font-weight: 600;

  background-color: #ffaa70;

  border-radius: 50%;

  overflow: hidden;

  img {
    max-width: 100%;
    height: auto;
  }
`;

function getAvatarRemSize(size: Size) {
  switch (size) {
    case "regular":
      return 2.5;
    case "small":
      return 2;
  }

  throw new Error("Incorrect avatar size");
}
