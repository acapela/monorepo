import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { DropFileContext } from "~richEditor/DropFileContext";
import { theme } from "~ui/theme";

import { NewRequest, NewRequestProps } from "./NewRequest";

export const NewRequestView = observer(function NewRequestView(props: NewRequestProps) {
  return (
    <>
      <UIDropFileHolder>
        <NewRequest {...props} />
      </UIDropFileHolder>
    </>
  );
});

const UIDropFileHolder = styled(DropFileContext)<{}>`
  height: 100%;
  width: 100%;
  ${theme.common.flexDiv}
`;
