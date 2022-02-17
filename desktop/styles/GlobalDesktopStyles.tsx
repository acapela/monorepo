import { createGlobalStyle } from "styled-components";

import { theme } from "@aca/ui/theme";

export const GlobalDesktopStyles = createGlobalStyle`
  body.desktop {
    --pointer: default;
    -webkit-app-region: no-drag;
  }

  body, html, #root {
    min-height: 100vh;
    max-height: 100vh;
    ${theme.colors.text.asColor};
    ${theme.colors.layout.background.asBg}    
  }

  body.no-transitions {
    * {
      transition: none !important;
    }
  }

  * {
    cursor: default;
  }

  input, textarea {
    cursor: text;
  }

  #root {
    display: flex;
    flex-direction: column;
  }
`;
