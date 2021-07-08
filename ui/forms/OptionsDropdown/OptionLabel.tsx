import React, { ReactNode } from "react";
import styled from "styled-components";
import { SecondaryText } from "~ui/typo";

interface Props {
  label: string;
  icon?: ReactNode;
  className?: string;
}

export const OptionLabel = styled(function OptionLabel({ label, icon, className }: Props) {
  return (
    <UIHolder className={className}>
      {icon && <UIIcon>{icon}</UIIcon>}
      <SecondaryText>{label}</SecondaryText>
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  user-select: none;
  flex-grow: 0;

  ${SecondaryText} {
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
