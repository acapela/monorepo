import styled from "styled-components";

import { theme } from "./theme";

export const Badge = styled.div<{}>`
  font-weight: bold;
  /* TODO: PR */
  font-size: 0.875rem;
  /* TODO PR */
  background-color: rgb(136 136 136 / 10%);
  padding: 0.5em 0.75em;
  ${theme.radius.secondaryItem};
`;
