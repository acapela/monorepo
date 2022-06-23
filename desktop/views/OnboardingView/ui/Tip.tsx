import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

interface Props {
  children: ReactNode;
}

export const OnboardingTip = observer(({ children }: Props) => {
  return (
    <UITip>
      Tip: <UITipContent>{children}</UITipContent>
    </UITip>
  );
});

const UITip = styled.div`
  ${theme.typo.noteTitle};
`;

const UITipContent = styled.div`
  ${theme.typo.noteTitle.secondary};
  display: inline-block;
`;
