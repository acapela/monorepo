import { setColorOpacity } from "~shared/colors";

const BLACK = "#000";

function createShadowCss(size: number, opacity = 0.2) {
  const shadowColor = setColorOpacity(BLACK, opacity);

  return `0 0 ${size}rem ${shadowColor};`;
}

export const shadow = {
  small: createShadowCss(1),
  medium: createShadowCss(2),
  large: createShadowCss(4),
};

export const borderRadius = {
  small: "0.25rem",
  medium: "0.5rem",
  large: "1rem",
};

export const fontSize = {
  copy: "1rem",
  pageTitle: "2rem",
};
