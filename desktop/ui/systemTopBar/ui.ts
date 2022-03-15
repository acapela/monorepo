import styled, { css } from "styled-components";

import { theme } from "@aca/ui/theme";

export const SYSTEM_BAR_HEIGHT = 52;
export const TRAFFIC_LIGHTS_NEEDED_SPACE = 90;

export const TopBarDivider = styled.div`
  ${theme.colors.layout.divider.asBg};
  align-self: stretch;
  width: 1px;
  margin: 4px 8px;
`;

export const systemBarPlaceholder = css`
  height: ${SYSTEM_BAR_HEIGHT}px;
`;
