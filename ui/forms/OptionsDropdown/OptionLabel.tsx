import React, { ReactNode } from "react";
import styled from "styled-components";
import { SecondaryText } from "~ui/typo";

interface Props {
  label: string;
  icon?: ReactNode;
}

export function OptionLabel({ label, icon }: Props) {
  return (
    <UIHolder>
      {icon && <UIIcon>{icon}</UIIcon>}
      <SecondaryText>{label}</SecondaryText>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex: 1;
  align-items: center;

  ${SecondaryText} {
    flex: 1;
  }

  svg {
    font-size: 24px;
  }
`;

const UIIcon = styled.div`
  margin-right: 8px;
`;
