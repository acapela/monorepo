import styled from "styled-components";
import { Button } from "./Button";
import { hoverActionCss } from "../transitions";

export const TransparentButton = styled(Button)`
  /* Hax: For some reason styled-component adds TransparentButton styles before Button so they have lower priority.
     Let's make sure they're used with && selector.
   */
  && {
    ${hoverActionCss}

    background-color: transparent;
    color: hsl(214.7, 11.8%, 31.6%);
  }
`;
