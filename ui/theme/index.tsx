import styled, { css, FlattenSimpleInterpolation, StyledComponent } from "styled-components";
import { HTMLMotionProps, motion } from "framer-motion";
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

const BACKUP_FONTS = `"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Arial", "sans-serif"`;

// function createComponentAndStyles<T extends keyof JSX.IntrinsicElements>(
//   type: T,
//   styleCss: FlattenSimpleInterpolation
// ) {
//   const Component = styled(motion.type])`
//     ${styleCss}
//   ` as Styled(motion.omponent<T, any>);

//   return [Component, styleCss] as const;
// }

const typographyCommonStyles = css`
  line-height: 1.2;
  letter-spacing: -0.02%;
`;

const fontFamily = {
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

export const TextH1 = styled(motion.h1)`
  ${fontFamily.speziaExtended}
  ${typographyCommonStyles};
  font-size: 40px;
`;

export const TextH2 = styled(motion.h2)`
  ${fontFamily.speziaExtended}
  ${typographyCommonStyles};
  font-size: 32px;
`;

export const TextH3 = styled(motion.h3)`
  ${fontFamily.spezia};
  ${typographyCommonStyles};
  font-size: 24px;
`;

export const TextH3Extended = styled(motion.h3)`
  ${fontFamily.speziaExtended}
  ${typographyCommonStyles};
  font-size: 24px;
`;

export const TextH4 = styled(motion.h4)`
  ${fontFamily.spezia};
  ${typographyCommonStyles};
  font-size: 20px;
`;

export const TextH5 = styled(motion.h5)`
  ${fontFamily.spezia};
  ${typographyCommonStyles};
  font-size: 18px;
`;

export const TextH6 = styled(motion.h6)`
  ${fontFamily.spezia};
  ${typographyCommonStyles};
`;

export const TextBody = styled(motion.span)`
  ${fontFamily.inter}
  line-height: 1.5;
`;

export const TextBodyMedium = styled(motion.span)`
  ${fontFamily.inter}
  font-weight: bold;
  line-height: 1.5;
`;

export const TextBody14 = styled(motion.span)`
  ${fontFamily.inter}
  font-size: 14px;
  line-height: 1.5;
`;

export const TextBody14Medium = styled(motion.span)`
  ${fontFamily.inter}
  font-size: 14px;
  font-weight: bold;
  line-height: 1.5;
`;

export const TextBody12 = styled(motion.span)`
  ${fontFamily.inter}
  font-size: 12px;
  line-height: 1.5;
`;

export const TextBody12Medium = styled(motion.span)`
  ${fontFamily.inter}
  font-size: 12px;
  font-weight: bold;
  line-height: 1.5;
`;

export const TextButton14Semibold = styled(motion.span)`
  ${fontFamily.spezia};
  ${typographyCommonStyles};
  font-size: 14px;
`;

export const TextButton14Medium = styled(motion.span)`
  ${fontFamily.spezia};
  ${typographyCommonStyles};
  font-size: 14px;
  font-weight: bold;
`;

export const TextButtonMedium = styled(motion.span)`
  ${fontFamily.spezia};
  ${typographyCommonStyles};
  font-weight: bold;
`;

export const TextButtonSemibold = styled(motion.span)`
  ${fontFamily.spezia};
  ${typographyCommonStyles};
`;

export const TextButton12Medium = styled(motion.span)`
  ${fontFamily.spezia};
  ${typographyCommonStyles};
  font-weight: bold;
  font-size: 12px;
`;

export const TextButton12Semibold = styled(motion.span)`
  ${fontFamily.spezia};
  ${typographyCommonStyles};
  font-size: 12px;
`;

export const TextMeta12Mono = styled(motion.span)`
  ${fontFamily.speziaMono}
  ${typographyCommonStyles};
  font-weight: bold;
  font-size: 12px;
`;

export const TextMeta10Mono = styled(motion.span)`
  ${typographyCommonStyles};
  ${fontFamily.speziaMono}
  font-size: 10px;
  font-weight: bold;
`;

export const TextMeta14Mono = styled(motion.span)`
  ${fontFamily.speziaMono}
  ${typographyCommonStyles};
  font-size: 14px;
  font-weight: bold;
`;

export const TextMeta10Inter = styled(motion.span)`
  ${fontFamily.inter}
  ${typographyCommonStyles};
  font-weight: bold;
  font-size: 10px;
`;

export const TextMeta14Inter = styled(motion.span)`
  ${fontFamily.inter}
  ${typographyCommonStyles};
  font-size: 14px;
  font-weight: bold;
`;

export const TextMetaInter = styled(motion.span)`
  ${fontFamily.inter}
  ${typographyCommonStyles};
  font-weight: bold;
`;

export const TextMetaMono = styled(motion.span)`
  ${fontFamily.speziaMono}
  ${typographyCommonStyles};
  font-weight: bold;
`;

export const shadows = {
  card: css`
    box-shadow: 0px 3px 16px rgba(43, 42, 53, 0.07);
  `,
  frame: css`
    box-shadow: 0px 12px 68px rgba(0, 0, 0, 0.05);
  `,
};
