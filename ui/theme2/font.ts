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

export function createFontStyles(parentStyles: FlattenSimpleInterpolation[]): Font {
  return {
    get spezia() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-family: Spezia;
        `,
      ]);
    },
    get speziaExtended() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-family: Spezia;
        `,
      ]);
    },
    get speziaMono() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-family: Spezia;
        `,
      ]);
    },
    get inter() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-family: Spezia;
        `,
      ]);
    },

    get h1() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-size: 16px;
        `,
      ]);
    },
    get h2() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-size: 16px;
        `,
      ]);
    },
    get h3() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-size: 16px;
        `,
      ]);
    },
    get h4() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-size: 16px;
        `,
      ]);
    },
    get h5() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-size: 16px;
        `,
      ]);
    },
    get h6() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-size: 16px;
        `,
      ]);
    },
    get body() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-size: 16px;
        `,
      ]);
    },
    get body14() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-size: 16px;
        `,
      ]);
    },
    get body12() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-size: 16px;
        `,
      ]);
    },

    get medium() {
      return createFontStyles([
        ...parentStyles,
        css`
          font-weight: 500;
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
