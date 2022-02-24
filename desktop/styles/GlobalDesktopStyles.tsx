import { createGlobalStyle } from "styled-components";

import { theme } from "@aca/ui/theme";

export const GlobalDesktopStyles = createGlobalStyle`
  body.desktop {
    --pointer: default;
    -webkit-app-region: no-drag;
  }

  body.main-window {
    ${theme.colors.layout.background.asBgWithReadableText};
  }

  body, html, #root {
    min-height: 100vh;
    max-height: 100vh;
    margin: 0;
    ${theme.colors.text.asColor};
  }

  body.no-transitions {
    * {
      transition: none !important;
    }
  }

  * {
    cursor: default;
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
