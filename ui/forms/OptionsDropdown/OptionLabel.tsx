import React, { ReactNode } from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

interface Props {
  label: string;
  icon?: ReactNode;
  className?: string;
}

export const OptionLabel = styled(function OptionLabel({ label, icon, className }: Props) {
  return (
    <UIHolder className={className}>
      {icon && <UIIcon>{icon}</UIIcon>}
      <UIBody>{label}</UIBody>
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  display: flex;
  flex: 1;
  align-items: center;
  user-select: none;

  ${() => UIBody} {
    flex: 1;
  }

  svg {
    font-size: 24px;
  }
`;

const UIBody = styled.div`
  ${theme.typo.content};
`;

const UIIcon = styled.div<{}>`
  margin-right: 8px;
  font-size: 24px;
`;
