import { css } from "styled-components";
import { normalize } from "styled-normalize";
import { reset } from "styled-reset";

/* Additional normalization styles */
export const base = css`
  ${normalize};
  ${reset};

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
`;
