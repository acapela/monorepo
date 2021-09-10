import styled, { css } from "styled-components";

import { PopPresenceAnimator } from "../animations";

export const CornerButtonWrapper = styled(PopPresenceAnimator)<{ showOnlyIfParentHovered?: boolean }>`
  position: absolute;
  top: 8px;
  right: 8px;

  ${(props) => {
    if (props.showOnlyIfParentHovered) {
      return css`
        /* Make me visible only if my direct parent is hovered */
        * > & {
          opacity: 0;
        }

        *:hover > & {
          opacity: 1;
        }
      `;
    }
  }}}
`;
