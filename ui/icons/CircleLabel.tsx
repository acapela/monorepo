import { ReactNode } from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

interface Props {
  className?: string;
  label: ReactNode;
  // TODO PR: named size
}

export const CircleLabel = styled(function CircleLabel({ className, label }: Props) {
  return (
    <UIHolder className={className}>
      <UILabel>{label}</UILabel>
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  ${theme.colors.secondary.asBgWithReadableText};
  ${theme.radius.circle};

  display: flex;
  align-items: center;
  justify-content: center;

  height: 1em;
  width: 1em;
  min-width: 1em;
`;

// Separating label font-size from UIHolder allows us to resize the CircleLabel based
// on inherited fontsize
const UILabel = styled.span`
  ${theme.typo.item.subtitle};
`;
