import Link from "next/link";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { theme } from "~ui/theme";

interface Props {
  href: string;
  children: ReactNode;
}

export const ToDoItem = ({ href, children }: Props) => {
  return (
    <Link href={href} passHref>
      <UIHolder>
        <UICheckbox />
        {children}
      </UIHolder>
    </Link>
  );
};

const UICheckbox = styled.div<{}>`
  width: 20px;
  min-width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid ${theme.colors.layout.softLine()};
`;

const UIHolder = styled.a<{}>`
  display: flex;
  align-items: center;
  gap: 16px;

  padding: 12px;
  background: ${theme.colors.layout.foreground()};
  ${theme.borderRadius.card};
  ${theme.shadow.cardItem};

  cursor: pointer;
  ${theme.transitions.hover()};

  :hover {
    ${theme.shadow.card};
  }
`;
