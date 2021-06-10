import styled from "styled-components";
import { Button } from "./Button";
import { hoverActionCss, hoverActionActiveCss } from "../transitions";

export const TransparentButton = styled(Button)`
  /* Hax: For some reason styled-component adds TransparentButton styles before Button so they have lower priority.
     Let's make sure they're used with && selector.
   */
  && {
    background-color: transparent;
    ${(props) => {
      if (props.onClick) {
        return hoverActionCss;
      }

      // If there is no onClick handler - highlight button all the time and don't add hover effect.
      return hoverActionActiveCss;
    }}

    color: hsl(214.7, 11.8%, 31.6%);
  }
`;
