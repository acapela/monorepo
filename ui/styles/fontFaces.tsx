import { createGlobalStyle, css } from "styled-components";

// We're using font-display: fallback to prevent flickering:
// https://styled-components.com/docs/faqs#how-do-i-fix-flickering-text-after-server-side-rendering

export const fontFacesStyles = css`
  @font-face {
    font-family: "Spezia";
    src: url("/fonts/Spezia-SemiBold.woff2") format("woff2"), url("/fonts/Spezia-SemiBold.woff") format("woff");
    font-weight: 600;
    font-style: normal;
    font-display: fallback;
  }

  @font-face {
    font-family: "Spezia";
    src: url("/fonts/Spezia-Medium.woff2") format("woff2"), url("/fonts/Spezia-Medium.woff") format("woff");
    font-weight: 500;
    font-style: normal;
    font-display: fallback;
  }

  @font-face {
    font-family: "Spezia Extended";
    src: url("/fonts/SpeziaExtended-Black.woff2") format("woff2"),
      url("/fonts/SpeziaExtended-Black.woff") format("woff");
    font-weight: 900;
    font-style: normal;
    font-display: fallback;
  }

  @font-face {
    font-family: "Spezia Extended";
    src: url("/fonts/SpeziaExtended-SemiBold.woff2") format("woff2"),
      url("/fonts/SpeziaExtended-SemiBold.woff") format("woff");
    font-weight: 600;
    font-style: normal;
    font-display: fallback;
  }

  @font-face {
    font-family: "Spezia Mono";
    src: url("/fonts/SpeziaMono-Medium.woff2") format("woff2"), url("/fonts/SpeziaMono-Medium.woff") format("woff");
    font-weight: 500;
    font-style: normal;
    font-display: fallback;
  }

  @font-face {
    font-family: "Permanent Marker";
    src: url("/fonts/PermanentMarker-Regular.ttf") format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: fallback;
  }
`;

export const FontFaces = createGlobalStyle`
  ${fontFacesStyles};
`;
