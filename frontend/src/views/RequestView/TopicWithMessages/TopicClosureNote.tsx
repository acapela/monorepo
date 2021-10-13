import styled from "styled-components";

import { theme } from "~ui/theme";

export const TopicClosureBanner = styled(() => (
  <UIBanner>
    <UIClosingInfo>
      <UIStrongText>Note:</UIStrongText> If you would like to add something to this Topic, please reopen it to continue
      all discussions here.
    </UIClosingInfo>
  </UIBanner>
))``;

const UIBanner = styled.div<{}>`
  padding: 16px;
  max-width: 600px;

  ${theme.radius.panel};

  background-color: transparent;
  border: 1px solid ${theme.colors.layout.background.border};
`;

const UIClosingInfo = styled.div<{}>`
  font-weight: 400;
  line-height: 1.5;
`;

const UIStrongText = styled.span<{}>`
  font-weight: 500;
`;
