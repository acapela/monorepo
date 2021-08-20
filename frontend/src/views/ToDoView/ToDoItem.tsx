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
      <UIHolder>{children}</UIHolder>
    </Link>
  );
};

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
