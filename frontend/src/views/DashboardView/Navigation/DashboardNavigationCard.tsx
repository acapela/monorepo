import styled from "styled-components";

import { theme } from "~ui/theme";
import { hoverActionCss } from "~ui/transitions";

export const DashboardNavigationCard = styled.div`
  background-color: ${theme.colors.layout.foreground()};
  ${theme.borderRadius.item};
  padding: 12px 16px;
  gap: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;

  ${hoverActionCss}
`;
