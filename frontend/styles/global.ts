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

    font-family: "Kumbh Sans", "Inter", "Open Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto",
      "Helvetica", "Arial", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }
`;
