import { css } from "styled-components";

import { devAssignWindowVariable } from "@aca/shared/dev";

import { base } from "./base";
import { fontFacesStyles } from "./fontFaces";

export const global = css`
  ${base}
  ${fontFacesStyles}

  html {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -moz-font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;

    font-family: "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Arial", "sans-serif";
    font-weight: 400;
    color: #232b35;
  }

  body.css-debug {
    * {
      outline: 1px solid red;
    }
  }

  body {
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-size: 14px;
  }
`;

devAssignWindowVariable("cssDebug", () => {
  document.body.classList.toggle("css-debug");
});
