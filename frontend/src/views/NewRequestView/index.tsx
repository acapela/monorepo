import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { DropFileContext } from "~richEditor/DropFileContext";

import { NewRequest } from "./NewRequest";

export const NewRequestView = observer(function NewRequestView() {
  return (
    <>
      <UIDropFileHolder>
        <NewRequest />
      </UIDropFileHolder>
    </>
  );
});

const UIDropFileHolder = styled(DropFileContext)<{}>`
  height: 100%;
  width: 100%;
`;
