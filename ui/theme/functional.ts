import styled from "styled-components";
import { injectProps } from "~shared/components/injectProps";
import { PRIMARY_PINK_1, PRIMARY_TEAL_1 } from "~ui/colors";
import { TextBody14, TextH2 } from "./typography";

export const EntityKindLabel = styled(injectProps(TextBody14, { speziaMono: true }))`
  color: ${PRIMARY_PINK_1};
  letter-spacing: 0.4em;

  @supports (-webkit-background-clip: text) {
    background: linear-gradient(90deg, ${PRIMARY_TEAL_1}, ${PRIMARY_PINK_1});
    background-clip: text;
    text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
  }
`;

export const HeroItemTitle = injectProps(TextH2, { speziaExtended: true });

export const CategoryNameLabel = injectProps(TextBody14, { speziaMono: true, secondary: true });
