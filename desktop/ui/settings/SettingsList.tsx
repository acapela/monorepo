import React, { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
}

export function SettingsList({ children }: Props) {
  return <UIHolder>{children}</UIHolder>;
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;
