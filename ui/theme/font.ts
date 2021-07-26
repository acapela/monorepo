import { css, FlattenSimpleInterpolation } from "styled-components";
import { ThemeTarget } from "./themeTarget";

interface Font extends ThemeTarget {
  spezia: Font;
  speziaExtended: Font;
  speziaMono: Font;
  inter: Font;

  h1: Font;
  h2: Font;
  h3: Font;
  h4: Font;
  h5: Font;
  h6: Font;
  body: Font;
  body14: Font;
  body12: Font;

  medium: Font;
  semibold: Font;
}

const BACKUP_FONT_FAMILIES = `"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Arial", "sans-serif"`;

const headingBaseStyles = css`
  line-height: 1.2;
  letter-spacing: -2%;
  font-weight: 500;
`;

const bodyBaseStyles = css`
  line-height: 1.5;
  font-weight: normal;
  letter-spacing: 0;
`;

export function createFontStyles(parentStyles: FlattenSimpleInterpolation[]): Font {
  return {
    get spezia() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-family: "Spezia", ${BACKUP_FONT_FAMILIES};
        `,
      ]);
    },
    get speziaExtended() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-family: "Spezia Extended", ${BACKUP_FONT_FAMILIES};
        `,
      ]);
    },
    get speziaMono() {
      return createFontStyles([
        ...parentStyles,
        css`
          letter-spacing: -2%;
          font-family: "Spezia Mono", ${BACKUP_FONT_FAMILIES};
        `,
      ]);
    },
    get inter() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-family: "Inter", ${BACKUP_FONT_FAMILIES};
        `,
      ]);
    },

    get h1() {
      return createFontStyles([
        ...parentStyles,
        headingBaseStyles,
        css`
          font-size: 2.5rem;
        `,
      ]);
    },
    get h2() {
      return createFontStyles([
        ...parentStyles,
        headingBaseStyles,
        css`
          font-size: 2rem;
        `,
      ]);
    },
    get h3() {
      return createFontStyles([
        ...parentStyles,
        headingBaseStyles,
        css`
          font-size: 1.5rem;
        `,
      ]);
    },
    get h4() {
      return createFontStyles([
        ...parentStyles,
        headingBaseStyles,
        css`
          font-size: 1.25rem;
        `,
      ]);
    },
    get h5() {
      return createFontStyles([
        ...parentStyles,
        headingBaseStyles,
        css`
          font-size: 1.125rem;
        `,
      ]);
    },
    get h6() {
      return createFontStyles([...parentStyles, headingBaseStyles]);
    },
    get body() {
      return createFontStyles([...parentStyles, bodyBaseStyles]);
    },
    get body14() {
      return createFontStyles([
        ...parentStyles,
        bodyBaseStyles,
        css`
          font-size: 0.875rem;
        `,
      ]);
    },
    get body12() {
      return createFontStyles([
        ...parentStyles,
        bodyBaseStyles,
        css`
          font-size: 0.75rem;
        `,
      ]);
    },

    get medium() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-weight: bold;
        `,
      ]);
    },
    get semibold() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-weight: 500;
        `,
      ]);
    },
    getStyles() {
      return css`
        ${parentStyles}
      `;
    },
  };
}

export function font(): Font {
  return createFontStyles([]);
}
