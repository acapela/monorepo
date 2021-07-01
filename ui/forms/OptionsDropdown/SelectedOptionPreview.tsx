import React, { ReactNode } from "react";
import styled from "styled-components";
import { SecondaryText } from "~ui/typo";
import { borderRadius } from "~ui/baseStyles";
import { BACKGROUND_ACCENT } from "~ui/colors";

interface Props {
  label: string;
  icon?: ReactNode;
}

export function SelectedOptionPreview({ label, icon }: Props) {
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

  background-color: ${BACKGROUND_ACCENT};
  padding: 8px;
  white-space: nowrap;
  ${borderRadius.item};

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
