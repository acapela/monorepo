import styled from "styled-components";

import { theme } from "~ui/theme";

export const UserBasicInfoContainer = styled.div<{}>`
  display: flex;
  align-items: center;
  ${theme.spacing.horizontalActions.asGap};
`;
