import React from "react";
import styled from "styled-components";

import { NewFilterCreator } from "./NewFilterCreator";

export function ListFilters() {
  return (
    <UIHolder>
      <NewFilterCreator
        onCreateRequest={(filter) => {
          //
        }}
      />
    </UIHolder>
  );
}

const UIHolder = styled.div``;
