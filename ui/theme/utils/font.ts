import { StylesPart, css } from "styled-components";

import { phone } from "@aca/ui/responsive";

import { ThemeTarget, createThemeTarget } from "./themeTarget";

const SECONDARY_TEXT_OPACITY = 0.8;

type FontVariants = {
  spezia: Font;
  speziaExtended: Font;
  speziaMono: Font;
  inter: Font;
  permanentMarker: Font;

  semibold: Font;
  medium: Font;
  black: Font;
  bold: Font;

  center: Font;
  right: Font;

  upper: Font;

  size(sizeInPx: number, mobileSizeInPx?: number): Font;

  readingLineHeight: Font;
  headerLineHeight: Font;
  resetLineHeight: Font;
  nowrap: Font;

  opacity(opacity: number): Font;
  secondary: Font;
};

type Font = ThemeTarget<FontVariants>;

const BACKUP_FONT_FAMILIES = `"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Arial", "sans-serif"`;

const BASE_FONT_SIZE_PX = 16;

function pxToRem(px: number) {
  return px / BASE_FONT_SIZE_PX;
}

export function font(parentStyles: StylesPart[] = []): Font {
  function withStyles(...styles: StylesPart[]) {
    return font([...parentStyles, ...styles]);
  }

  function withFontSize(px: number, mobilePx: number) {
    return withStyles(css`
      font-size: ${pxToRem(px)}rem;
      ${phone(
        css`
          font-size: ${pxToRem(mobilePx)}rem;
        `
      )}
    `);
  }

  const self: Font = createThemeTarget<FontVariants>(
    () => {
      return css`
        ${parentStyles}
      `;
    },
    {
      get semibold() {
        return withStyles(css`
          font-weight: 600;
        `);
      },
      get nowrap() {
        return withStyles(css`
          white-space: nowrap;
        `);
      },
      get medium() {
        return withStyles(css`
          font-weight: 500;
        `);
      },
      get bold() {
        return withStyles(css`
          font-weight: 700;
        `);
      },
      get black() {
        return withStyles(css`
          font-weight: 900;
        `);
      },
      get spezia() {
        return withStyles(css`
          font-family: "Spezia", ${BACKUP_FONT_FAMILIES};
        `);
      },
      get speziaExtended() {
        return withStyles(css`
          font-family: "Spezia Extended", ${BACKUP_FONT_FAMILIES};
        `);
      },
      get speziaMono() {
        return withStyles(css`
          letter-spacing: -2%;
          font-family: "Spezia Mono", ${BACKUP_FONT_FAMILIES};
        `);
      },
      get inter() {
        return withStyles(css`
          font-family: "Inter", ${BACKUP_FONT_FAMILIES};
        `);
      },

      get permanentMarker() {
        return withStyles(css`
          font-family: "Permanent Marker", ${BACKUP_FONT_FAMILIES};
        `);
      },
      size(px, mobilePx = px) {
        return withFontSize(px, mobilePx);
      },
      opacity(opacity) {
        return withStyles(css`
          opacity: ${opacity};
        `);
      },
      get secondary() {
        return self.opacity(SECONDARY_TEXT_OPACITY);
      },
      get center() {
        return withStyles(css`
          text-align: center;
          margin-left: auto;
          margin-right: auto;
          align-self: center;
        `);
      },
      get right() {
        return withStyles(css`
          text-align: right;
        `);
      },
      get upper() {
        return withStyles(css`
          text-transform: uppercase;
        `);
      },
      get readingLineHeight() {
        return withStyles(css`
          line-height: 1.5em;
        `);
      },
      get headerLineHeight() {
        return withStyles(css`
          line-height: 1.2em;
        `);
      },
      get resetLineHeight() {
        return withStyles(css`
          line-height: 1em;
        `);
      },
    }
  );

  return self;
}
