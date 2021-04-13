import { css } from "styled-components";
import { normalize } from "styled-normalize";
import { reset } from "styled-reset";

const fontFaces = css`
  @font-face {
    font-family: "Kumbh Sans";
    src: url("/fonts/kumbh/KumbhSans-Light.woff2") format("woff2"),
      url("/fonts/kumbh/KumbhSans-Light.woff") format("woff");
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Kumbh Sans";
    src: url("/fonts/kumbh/KumbhSans-Bold.woff2") format("woff2"),
      url("/fonts/kumbh/KumbhSans-Bold.woff") format("woff");
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Kumbh Sans";
    src: url("/fonts/kumbh/KumbhSans-Regular.woff2") format("woff2"),
      url("/fonts/kumbh/KumbhSans-Regular.woff") format("woff");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

/* Additional normalization styles */
export const base = css`
  ${normalize};
  ${reset};
  ${fontFaces};

  *,
  ::before,
  ::after {
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #e5e7eb;
  }

  a {
    color: inherit;
    text-decoration: inherit;
  }

  img,
  svg,
  video,
  canvas,
  audio,
  iframe,
  embed,
  object {
    display: block;
    vertical-align: middle;
  }

  img,
  video {
    max-width: 100%;
    height: auto;
  }
`;
