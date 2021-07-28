import React, { useState } from "react";
import styled from "styled-components";
import { Maybe } from "~gql";
import { getInitials } from "~frontend/utils";
import { borderRadius } from "~ui/baseStyles";
import { NamedSize, getNamedSizeValue } from "~ui/namedSize";
import { PRIMARY_PINK_1, WHITE } from "~ui/theme/colors/base";

interface Props {
  name?: Maybe<string>;
  url?: string | null;
  className?: string;
  size?: AvatarSize;
  disableNameTooltip?: boolean;
}

export type AvatarSize = NamedSize | "inherit";

export const Avatar = styled(({ url, name, className, size = "regular", disableNameTooltip }: Props) => {
  const [failedToLoad, setFailedToLoad] = useState(false);

  if (!url || failedToLoad) {
    return (
      <UIHolder size={size} className={className}>
        <UINameLabel>{!!name && getInitials(name)}</UINameLabel>
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

  font-size: ${(props) => getAvatarSize(props.size)};

  width: 1em;
  min-width: 1em;
  height: 1em;

  font-weight: 600;

  background-color: ${PRIMARY_PINK_1};
  color: ${WHITE};

  ${borderRadius.circle}
  overflow: hidden;

  img {
    max-width: 100%;
    height: auto;
  }
`;

const UINameLabel = styled.span`
  font-size: 0.5em;
`;

function getAvatarSize(size: AvatarSize) {
  if (size === "inherit") return "1em";

  const sizeInPx = getNamedSizeValue(size);

  return `${sizeInPx}px`;
}
