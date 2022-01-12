import { ReactNode } from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

interface Props {
  children: ReactNode;
  alternative?: ReactNode;
}

export function ActionWithAlternative({ alternative, children }: Props) {
  return (
    <UIHolder>
      {children}
      {alternative}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  ${theme.spacing.close.asGap}
`;
