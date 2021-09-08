import Link from "next/link";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { UICardListItem } from "~frontend/ui/rooms/RoomsList/shared";
import { theme } from "~ui/theme";

interface Props {
  href: string;
  children: ReactNode;
}

export const ToDoItem = ({ href, children }: Props) => {
  return (
    <Link href={href} passHref>
      <UILinkWrapper>
        <UIHolder>{children}</UIHolder>
      </UILinkWrapper>
    </Link>
  );
};

const UIHolder = styled(UICardListItem)<{}>`
  background: ${theme.colors.layout.foreground()};
`;

const UILinkWrapper = styled.a<{}>``;
