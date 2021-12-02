import styled from "styled-components";

import { theme } from "~ui/theme";

export const UISettingsPanel = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px;

  ${theme.colors.layout.background.withBorder.asBg};
  ${theme.radius.primaryItem};

  width: 100%;
`;

export const UISettingsTitle = styled.h3<{}>`
  ${theme.typo.secondaryTitle};
`;
