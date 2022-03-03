import { createGlobalStyle } from "styled-components";

import { theme } from "@aca/ui/theme";

export const GlobalDesktopStyles = createGlobalStyle`
  body.desktop {
    --pointer: default;
    -webkit-app-region: no-drag;
  }
  body, html {
    margin: 0;
  }

  body, html, #root {
    min-height: 100vh;
    max-height: 100vh;
    
    ${theme.colors.text.asColor};
  }

  body.no-transitions {
    * {
      transition: none !important;
    }
  }

  * {
    cursor: default;
    user-select: none;
  }

  * {
    box-sizing: border-box;
  }

  input, textarea {
    cursor: text;
  }

  #root {
    display: flex;
    flex-direction: column;
  }
`;
