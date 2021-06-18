import React, { useState } from "react";
import styled from "styled-components";
import { Maybe } from "~gql";
import { getInitials } from "~frontend/utils";
import { borderRadius } from "~ui/baseStyles";

interface Props {
  name?: Maybe<string>;
  url?: string | null;
  className?: string;
  size?: AvatarSize;
  disableNameTooltip?: boolean;
}

export type AvatarSize = "regular" | "small" | "font-size";

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
    <UIHolder data-tooltip={!disableNameTooltip && name} className={className} size={size}>
      <img src={url} alt={`${name}'s avatar`} title={name ?? ""} onError={() => setFailedToLoad(true)} />
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{ size: AvatarSize }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: ${(props) => getAvatarSize(props.size)};
  min-width: ${(props) => getAvatarSize(props.size)};
  height: ${(props) => getAvatarSize(props.size)};

  font-weight: 600;

  background-color: #ffaa70;

  ${borderRadius.circle}

  overflow: hidden;

  img {
    max-width: 100%;
    height: auto;
  }
`;

function getAvatarSize(size: AvatarSize) {
  switch (size) {
    case "regular":
      return "40px";
    case "small":
      return "32px";
    case "font-size":
      return "1rem";
  }

  throw new Error("Incorrect avatar size");
}
