import { createGlobalStyle } from "styled-components";

export const GlobalDesktopStyles = createGlobalStyle`
  body.desktop {
    --pointer: default;
    -webkit-app-region: no-drag;
  }

  body, html, #root {
    min-height: 100vh;
  }

  #root {
    display: flex;
    flex-direction: column;
  }
`;
