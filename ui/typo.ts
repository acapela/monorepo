import styled from "styled-components";

import { fontSize } from "./baseStyles";

export const PageTitle = styled.h1`
  font-size: ${fontSize.pageTitle};
  font-weight: 600;
`;

export const ItemTitle = styled.h3`
  font-size: ${fontSize.itemTitle};
  font-weight: 600;
`;

export const TextTitle = styled.h4`
  font-weight: 600;
`;

export const SecondaryText = styled.span`
  font-size: ${fontSize.label};
  font-weight: 400;
`;
