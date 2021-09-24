import styled from "styled-components";

import { theme } from "~ui/theme";

export const DashboardNavigationCard = styled.div`
  background-color: ${theme.colors.layout.foreground()};
  ${theme.borderRadius.item};
  padding: 8px 16px;
  gap: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;

  ${theme.transitions.hover()}
`;
