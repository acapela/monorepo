import styled from "styled-components";

import { theme } from "@aca/ui/theme";

export const UINavItem = styled.div<{ $isActive?: boolean }>`
  ${theme.colors.layout.background.interactive};
  ${theme.transitions.hover("background-color")}
  ${theme.box.control.regular.size.padding.radius}
  ${theme.typo.body.medium}

  ${(props) => props.$isActive && theme.colors.layout.background.hover.asBg};

  display: flex;
  gap: 8px;
  align-items: center;
`;
