import styled, { css } from "styled-components";

import { theme } from "@aca/ui/theme";

const badgeStyles = {
  primary: css`
    ${theme.colors.primary.asBgWithReadableText}
  `,
  secondary: css`
    ${theme.colors.primary.asColor};
    ${theme.colors.text.asBg};
  `,
  meta: css`
    ${theme.colors.layout.backgroundAccent.active.asBgWithReadableText}
  `,
};

export const UIPricingBadge = styled.div<{ $kind?: keyof typeof badgeStyles }>`
  padding: 4px 10px;
  text-transform: uppercase;
  ${theme.colors.primary.asBgWithReadableText};
  display: inline-flex;
  ${theme.radius.circle};
  ${theme.typo.noteTitle.resetLineHeight};
  white-space: nowrap;

  ${(props) => {
    if (props.$kind) {
      return badgeStyles[props.$kind];
    }
  }}
`;
