import { css } from "styled-components";
import { base } from "./base";

export const global = css`
  ${base}

  html {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -moz-font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;

    font-family: "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Arial", "sans-serif";
    font-weight: 500;
    color: #232b35;
  }

  body {
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
`;
