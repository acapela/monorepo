import { css } from "styled-components";
import { setColorOpacity } from "~shared/colors";
import { BLACK } from "./colors";

function createShadowCss(size: number, opacity = 0.2) {
  const shadowColor = setColorOpacity(BLACK, opacity);

  return css`
    box-shadow: 0 0 ${size}rem ${shadowColor};
  `;
}

export const shadow = {
  small: createShadowCss(1),
  medium: createShadowCss(2),
  large: createShadowCss(4),
  modal: css`
    box-shadow: 0px 100px 80px rgba(0, 0, 0, 0.07), 0px 64.8148px 46.8519px rgba(0, 0, 0, 0.0531481),
      0px 38.5185px 25.4815px rgba(0, 0, 0, 0.0425185), 0px 20px 13px rgba(0, 0, 0, 0.035),
      0px 8.14815px 6.51852px rgba(0, 0, 0, 0.0274815), 0px 1.85185px 3.14815px rgba(0, 0, 0, 0.0168519);
  `,
};

export const borderRadius = {
  menu: css`
    border-radius: 16px;
  `,
  card: css`
    border-radius: 16px;
  `,
  modal: css`
    border-radius: 16px;
  `,
  label: css`
    border-radius: 6px;
  `,
  input: css`
    border-radius: 12px;
  `,
  item: css`
    border-radius: 12px;
  `,
  circle: css`
    border-radius: 1000px;
  `,
  button: css`
    border-radius: 12px;
  `,
  tag: css`
    border-radius: 8px;
  `,
};

export const fontSize = {
  copy: "1rem",
  pageTitle: "2rem",
  itemTitle: "1.25rem",
  label: "0.875rem",
};

export const colors = {
  tooltip: {
    background: "#222",
    color: "#fff",
  },
};
