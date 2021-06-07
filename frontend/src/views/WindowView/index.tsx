import { ReactNode } from "react";
import styled from "styled-components";
import { shadow } from "~ui/baseStyles";
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

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
`;

const UIWindow = styled.div`
  background: #ffffff;
  ${shadow.modal};
  border-radius: 1rem;
  padding: 2rem;
`;

const UILogo = styled(Logo)`
  height: 3rem;
  margin-bottom: 2rem;
`;
