import { ReactNode } from "react";
import styled from "styled-components";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { HeroItemTitle } from "~ui/theme/functional";

interface Props {
  title: string;
  actions?: ReactNode;
  options?: PopoverMenuOption[];
}

export function PageHeader({ title, actions }: Props) {
  return (
    <UIHolder>
      <HeroItemTitle>{title}</HeroItemTitle>
      {actions && <UIActions>{actions}</UIActions>}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;

  ${HeroItemTitle} {
    flex-grow: 1;
  }
`;

const UIActions = styled.div``;
