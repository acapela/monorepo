import { ReactNode } from "react";
import styled from "styled-components";

import { FocusedActionLayout } from "~frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { AppRecoveryButtons } from "~frontend/utils/AppRecoveryButtons";

interface Props {
  title?: ReactNode;
  description: ReactNode;
  extraContent?: ReactNode;
  children?: ReactNode;
}

export function PlainErrorView({ title = "Something went wrong", description, extraContent, children }: Props) {
  return (
    <FocusedActionLayout hideLogo title={title} description={description}>
      {extraContent}
      <UIActions>{children ?? <AppRecoveryButtons />}</UIActions>
    </FocusedActionLayout>
  );
}

const UIActions = styled.div`
  display: flex;
  justify-content: center;
`;
