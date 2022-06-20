import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { openCompose } from "@aca/desktop/actions/compose";

import { TopBarActionButton } from "./TopBarActionButton";

export const ComposeButton = observer(() => {
  return (
    <UIHolder>
      <TopBarActionButton action={openCompose} />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  position: relative;
  // With drag enabled, hover does not properly work
  -webkit-app-region: no-drag;
`;
