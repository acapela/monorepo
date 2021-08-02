import { ReactNode } from "react";
import styled from "styled-components";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { HeroItemTitle } from "~ui/theme/functional";

interface Props {
  title: string;
  actionsNode?: ReactNode;
  options?: PopoverMenuOption[];
}

export function PageHeader({ title, actionsNode }: Props) {
  return (
    <UIHolder>
      <HeroItemTitle>{title}</HeroItemTitle>
      {actionsNode && <UIActions>{actionsNode}</UIActions>}
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  margin-bottom: 40px;

  ${HeroItemTitle} {
    flex-grow: 1;
  }
`;

const UIActions = styled.div<{}>``;
