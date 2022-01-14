import { createGlobalStyle } from "styled-components";

export const GlobalDesktopStyles = createGlobalStyle`
  body.desktop {
    --pointer: default;
    -webkit-app-region: drag;
  }
`;
