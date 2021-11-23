import React from "react";
import styled from "styled-components";

import { theme } from "~ui/theme";

export const NotFound = () => (
  <UIHolder>
    <UITitle>Not found</UITitle>
    <UIDescription>
      We could not find that topic or you have not been added to it yet. You are added to a conversation when someone
      @-mentions you.
    </UIDescription>
  </UIHolder>
);

const UIHolder = styled.div`
  max-width: 60ch;
  padding: 40px;
`;

const UITitle = styled.div`
  ${theme.typo.item.title};
`;

const UIDescription = styled.div`
  ${theme.typo.content.medium.secondary};
`;
