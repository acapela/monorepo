import React, { ReactNode } from "react";
import styled from "styled-components";
import { TextBody } from "~ui/typo";

interface Props {
  label: string;
  icon?: ReactNode;
  className?: string;
}

export const OptionLabel = styled(function OptionLabel({ label, icon, className }: Props) {
  return (
    <UIHolder className={className}>
      {icon && <UIIcon>{icon}</UIIcon>}
      <TextBody>{label}</TextBody>
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  user-select: none;
  flex-grow: 0;

  ${TextBody} {
    flex: 1;
  }

  svg {
    font-size: 24px;
  }
`;

const UIIcon = styled.div`
  margin-right: 8px;
  font-size: 24px;
`;
