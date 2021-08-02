import styled from "styled-components";
import { theme } from "~ui/theme";
import { PRIMARY_PINK_1, PRIMARY_TEAL_1 } from "~ui/theme/colors/base";

/**
 * The goal of this module is to create functional text styles that are used in multiple similar use cases.
 */

export const EntityKindLabel = styled.div<{}>`
  ${theme.font.body14.speziaMono.build}

  color: ${PRIMARY_PINK_1};
  letter-spacing: 0.4em;

  /* If possible, style 'gradient based' text color */
  @supports (-webkit-background-clip: text) {
    background: linear-gradient(90deg, ${PRIMARY_TEAL_1}, ${PRIMARY_PINK_1});
    background-clip: text;
    text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }
`;

export const HeroItemTitle = styled.div`
  ${theme.font.h2.speziaExtended.build}
`;

export const PrimaryItemTitle = styled.div`
  ${theme.font.h3.speziaExtended.build}
`;

export const CategoryNameLabel = styled.div`
  ${theme.font.body14.speziaMono.build}
  color: ${theme.colors.layout.supportingText()};
  /* TODO: move to a functional theme method. */
  opacity: 0.6;
`;
