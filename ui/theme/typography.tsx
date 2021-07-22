import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { motion } from "framer-motion";
import { typedKeys } from "~shared/object";
import { BASE_GREY_3 } from "~ui/colors";

/**
 * TODO: Those are not used yet. Goal is to replace current `ui/colors` with those.
 */
export const colors = {
  PrimaryAction: "rgba(48,30,49,1)",
  Primary: "rgba(67,42,69,1)",
  Active: "rgba(226,110,140,1)",
  ActionSupport: "rgba(204,99,126,1)",
  Secondary: "rgba(54,227,227,1)",
  SecondaryTeal2: "rgba(49,207,207,1)",
  SecondarySupport: "rgba(61,255,255,1)",
  SecondaryOrange1: "rgba(238,85,29,1)",
  SecondaryOrange2: "rgba(219,78,27,1)",
  SecondaryOrange3: "rgba(252,107,54,1)",
  Headings: "rgba(32,31,31,1)",
  Body: "rgba(54,53,53,1)",
  SupportingText: "rgba(121,121,121,1)",
  Lines: "rgba(233,233,233,1)",
  BackgroundAccent: "rgba(248,248,248,1)",
  White: "rgba(255,255,255,1)",
  StrongerLines: "rgba(210,210,210,1)",
  BackgroundAction: "rgba(244,244,244,1)",
  SupportRed: "rgba(240,43,94,1)",
  SupportGreen: "rgba(47,188,138,1)",
  SupportYellow: "rgba(219,222,120,1)",
};

/**
 * This module defines entire foundation for the app typography.
 *
 * The goal is to make 'public api' of them as simple as possible and also to reduce count of various components.
 *
 * As our current figma has 27 font styles, I was thinking how implement it without creating 27 react components.
 *
 * Styles in figma are like H3, H3Spezia, H3SpeziaExtended, H3SpeciaMedium etc.
 *
 * I noticed we have same font size, but various variants for font family and weight.
 *
 * Thus, here we'll have only one 'H3' component with other properties managed via props eg.
 *
 * <TextH3>Foo</TextH3>
 * <TextH3 semibold>Foo</TextH3>
 * <TextH3 spezia semibold>Foo</TextH3>
 * <TextH3 speziaMono medium>Foo</TextH3>
 *
 * etc.
 *
 * This way we have 'only' 8 components, which is all of the font sizes we got.
 *
 * TODO: with time let's see how it works. It might cause components using it have 'too direct' control over appearance of
 * typography which might be confusing "what props should I use here?"
 */

export const TextH1 = styled(motion.h1)<TypographyProps>`
  ${() => typographyCommonStyles};
  ${() => typographyStyles};
  font-size: 2.5rem;
`;

export const TextH2 = styled(motion.h2)<TypographyProps>`
  ${() => typographyCommonStyles};
  ${() => typographyStyles};
  font-size: 2rem;
`;

export const TextH3 = styled(motion.h3)<TypographyProps>`
  ${() => typographyCommonStyles};
  ${() => typographyStyles};
  font-size: 1.5rem;
`;

export const TextH4 = styled(motion.h4)<TypographyProps>`
  ${() => typographyStyles};
  ${() => typographyCommonStyles};
  font-size: 1.25rem;
`;

export const TextH5 = styled(motion.h5)<TypographyProps>`
  ${() => typographyStyles};
  ${() => typographyCommonStyles};
  font-size: 1.125rem;
`;

export const TextH6 = styled(motion.h6)<TypographyProps>`
  ${() => typographyStyles};
  ${() => typographyCommonStyles};
`;

export const TextBody = styled(motion.p)<TypographyProps>`
  ${() => typographyStyles};
  line-height: 1.5;
`;

export const TextBody14 = styled(motion.p)<TypographyProps>`
  ${() => typographyStyles};
  font-size: 0.875rem;
  line-height: 1.5;
`;

export const TextBody12 = styled(motion.p)<TypographyProps>`
  ${() => typographyStyles};
  font-size: 0.75rem;
  line-height: 1.5;
`;

export const TextMeta10 = styled(motion.p)<TypographyProps>`
  ${() => typographyStyles};
  font-size: 0.625rem;
  line-height: 1.2;
`;

export const TextMeta10Secondary = styled(TextMeta10)`
  color: ${BASE_GREY_3};
`;

export const TextMeta12 = styled(motion.p)<TypographyProps>`
  ${() => typographyStyles};
  font-size: 0.75rem;
  line-height: 1.2;
`;

/**
 * TODO: Those are exported from figma and not used yet.
 */
export const shadows = {
  card: css`
    box-shadow: 0px 3px 16px rgba(43, 42, 53, 0.07);
  `,
  frame: css`
    box-shadow: 0px 12px 68px rgba(0, 0, 0, 0.05);
  `,
};

/**
 * Typography utils.
 */
const BACKUP_FONTS = `"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Arial", "sans-serif"`;

const typographyCommonStyles = css`
  line-height: 1.2;
  letter-spacing: -0.02%;
`;

type FamilyType = "inter" | "spezia" | "speziaMono" | "speziaExtended";

const fontFamilyStyles: Record<FamilyType, FlattenSimpleInterpolation> = {
  spezia: css`
    font-family: "Spezia", ${BACKUP_FONTS};
  `,
  speziaExtended: css`
    font-family: "Spezia Extended", ${BACKUP_FONTS};
  `,
  speziaMono: css`
    font-family: "Spezia Mono", ${BACKUP_FONTS};
  `,
  inter: css`
    font-family: "Inter", ${BACKUP_FONTS};
  `,
};

type FamilyProp = VariantProp<FamilyType>;

function getFontFamilyStyle(props: FamilyProp) {
  const activeFamilyVariant =
    getActiveVariant<FamilyType>(props, ["inter", "spezia", "speziaMono", "speziaExtended"]) ?? "inter";

  return fontFamilyStyles[activeFamilyVariant];
}

type WeightType = "regular" | "medium" | "semibold";

type WeightProp = VariantProp<WeightType>;

const fontWeightStyles: Record<WeightType, FlattenSimpleInterpolation> = {
  regular: css`
    font-weight: normal;
  `,
  medium: css`
    font-weight: bold;
  `,
  semibold: css`
    font-weight: 500;
  `,
};

function getFontWeightStyle(props: WeightProp) {
  const activeWeightVariant = getActiveVariant<WeightType>(props, ["regular", "medium", "semibold"]) ?? "regular";

  return fontWeightStyles[activeWeightVariant];
}

const importanceStyles: Record<ImportanceType, FlattenSimpleInterpolation> = {
  // TODO: Those might get replaced by colors instead of opacity.
  secondary: css`
    opacity: 0.6;
  `,
  tertiary: css`
    opacity: 0.4;
  `,
};

type ImportanceType = "secondary" | "tertiary";

type ImportanceProp = VariantProp<ImportanceType>;

function getImportanceStyles(props: ImportanceProp) {
  const activeImportanceVariant = getActiveVariant<ImportanceType>(props, ["secondary", "tertiary"]) ?? null;

  if (!activeImportanceVariant) return null;

  return importanceStyles[activeImportanceVariant];
}

/**
 * Convert list of strings into props disctionary. Eg.
 *
 * converts type Foo = 'foo' | 'bar' into { foo?: boolean, bar?: boolean}.
 *
 * Use case:
 *
 * It is 'props sugar' so it is possible to use <Text bold /> instead of <Text weight="bold" />
 */
type VariantProp<N extends string> = { [key in N]?: boolean };

type TypographyProps = WeightProp & FamilyProp & ImportanceProp;

const typographyStyles = css`
  ${(props: TypographyProps) => {
    const family = getFontFamilyStyle(props);
    const weight = getFontWeightStyle(props);
    const importance = getImportanceStyles(props);

    return css`
      ${family};
      ${weight};
      ${importance};
    `;
  }}
`;

/**
 * Get's first active (true) prop variant from component props.
 *
 * eg
 *
 * type Color = 'red' | 'blue'
 *
 * getActiveVariant<Color>({someProp: 42, red: true}, ['red', 'blue']) -> "red"
 */
function getActiveVariant<N extends string>(prop: VariantProp<N>, propsList: N[]): N | null {
  const activeVariant = typedKeys(prop).find((propVariantName) => {
    if (!propsList.includes(propVariantName)) {
      return false;
    }

    const value = prop[propVariantName];

    return value === true;
  });

  return activeVariant ?? null;
}
