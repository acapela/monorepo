import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { exitFocusMode } from "@aca/desktop/actions/focus";
import { FocusSession } from "@aca/desktop/store/focus";
import { TopBarActionButton } from "@aca/desktop/ui/systemTopBar/TopBarActionButton";

interface Props {
  session: FocusSession;
}

export const FocusBarTools = observer(({ session }: Props) => {
  session;
  return (
    <UIHolder>
      <TopBarActionButton action={exitFocusMode} />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  gap: 4px;
`;
