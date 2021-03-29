import { css } from "styled-components";
import { normalize } from "styled-normalize";
import { reset } from "styled-reset";

/* Additional normalization styles */
export const base = css`
  ${normalize}
  ${reset}
  
  *,
  ::before,
  ::after {
    box-sizing: border-box; /* 1 */
    border-width: 0; /* 2 */
    border-style: solid; /* 2 */
    border-color: #e5e7eb; /* 2 */
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
