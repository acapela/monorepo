import { ReactNode } from "react";
import styled from "styled-components";

import { theme } from "~frontend/../../ui/theme";
import { Logo } from "~frontend/ui/Logo";

interface Props {
  children: ReactNode;
}

export function WindowView({ children }: Props) {
  return (
    <UIHolder>
      <UILogo />
      <UIWindow>{children}</UIWindow>
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
`;

const UIWindow = styled.div<{}>`
  background: #ffffff;
  ${theme.radius.panel};
  ${theme.shadow.modal};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
`;

const UILogo = styled(Logo)<{}>`
  height: 3rem;
  margin-bottom: 2rem;
`;
