import React, { useState } from "react";
import styled from "styled-components";

import { getInitials } from "@aca/frontend/utils";
import { Maybe } from "@aca/gql";
import { theme } from "@aca/ui/theme";

interface Props {
  name?: Maybe<string>;
  url?: string | null;
  className?: string;
  size?: AvatarSize;
  disableNameTooltip?: boolean;
}

export type AvatarSize = "inherit" | number;

export const Avatar = styled<Props>(({ url, name, className, size = "inherit", disableNameTooltip }) => {
  const [failedToLoad, setFailedToLoad] = useState(false);

  if (!url || failedToLoad) {
    return (
      <UIHolder size={size} className={className} aria-label={name ?? undefined}>
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

  ${theme.colors.functional.userAvatar.asBgWithReadableText};
  ${theme.radius.circle};
  overflow: hidden;

  img {
    max-width: 100%;
    height: auto;
  }
`;

const UINameLabel = styled.span<{}>`
  font-size: 0.5em;
`;

function getAvatarSize(size: AvatarSize) {
  if (size === "inherit") return "1em";

  return `${size}px`;
}
