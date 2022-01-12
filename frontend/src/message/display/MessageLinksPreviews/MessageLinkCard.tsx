import React from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

interface Props {
  href: string;
  icon: React.ReactNode;
  text: string;
}

export const MessageLinkCard = ({ href, icon, text }: Props) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <UIHolder>
        <UIIconHolder>{icon}</UIIconHolder>
        <UIText>{text}</UIText>
      </UIHolder>
    </a>
  );
};

const UIHolder = styled.div<{}>`
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;

  ${theme.transitions.hover()};
  ${theme.radius.primaryItem};
  ${theme.colors.action.secondary.interactive}
`;

const UIIconHolder = styled.div`
  display: flex;
  justify-content: center;
  width: 2em;
  svg {
    font-size: 2em;
  }
`;

const UIText = styled.p`
  ${theme.typo.content.bold}
`;
