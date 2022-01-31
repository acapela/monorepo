import { createGlobalStyle } from "styled-components";

export const GlobalDesktopStyles = createGlobalStyle`
  body.desktop {
    --pointer: default;
    -webkit-app-region: no-drag;
  }

  body, html, #root {
    min-height: 100vh;
    max-height: 100vh;
  }

  * {
    cursor: default;
  }

  #root {
    display: flex;
    flex-direction: column;
  }
`;
