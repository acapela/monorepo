import styled from "styled-components";

import { theme } from "@aca/ui/theme";

export const UICountIndicator = styled.div`
  ${theme.box.panel.badge.size.padding.radius};
  min-width: 3.5ch;

  ${theme.colors.layout.divider.asBg};
  ${theme.typo.noteTitle};
  text-align: center;
  justify-content: center;
`;
