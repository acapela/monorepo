import styled, { css } from "styled-components";

export const CornerButtonWrapper = styled.div<{ showOnlyIfParentHovered?: boolean }>`
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
