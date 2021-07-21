import styled from "styled-components";
import { injectProps } from "~shared/components/injectProps";
import { PRIMARY_PINK_1 } from "~ui/colors";
import { TextBody14, TextH2 } from "./typography";

export const EntityKindLabel = styled(injectProps(TextBody14, { speziaMono: true }))`
  color: ${PRIMARY_PINK_1};
  letter-spacing: 0.4em;
`;

export const HeroItemTitle = injectProps(TextH2, { speziaExtended: true });

export const CategoryNameLabel = injectProps(TextBody14, { speziaMono: true, secondary: true });
