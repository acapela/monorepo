import { css } from "styled-components";

export function hoverTransition(propName = "all") {
  return css`
    transition: 0.35s ${propName};

    /* Make transition faster on hover to have effect of 'quick' trigger and slow release. */
    &:hover {
      transition: 0.075s ${propName};
    }
  `;
}

export const transitions = {
  hover(propName = "all") {
    return css`
      transition: 0.35s ${propName};

      /* Make transition faster on hover to have effect of 'quick' trigger and slow release. */
      &:hover {
        transition: 0.075s ${propName};
      }
    `;
  },
};
