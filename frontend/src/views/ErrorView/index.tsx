import React, { ReactNode } from "react";
import styled from "styled-components";

import { FocusedActionLayout } from "@aca/frontend/src/layouts/FocusedActionLayout/FocusedActionLayout";

interface Props {
  title?: ReactNode;
  description: ReactNode;
  extraContent?: ReactNode;
  children?: ReactNode;
}

export function ErrorView({ title = "Something went wrong", description, extraContent, children }: Props) {
  return (
    <FocusedActionLayout hideLogo title={title} description={description}>
      {extraContent}
      <UIActions>{children}</UIActions>
    </FocusedActionLayout>
  );
}

const UIActions = styled.div`
  display: flex;
  justify-content: center;
`;
