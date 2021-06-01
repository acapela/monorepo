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

export const ACTION_ACTIVE_COLOR = "rgb(136 136 136 / 10%)";

export const hoverActionActiveCss = css`
  background-color: ${ACTION_ACTIVE_COLOR};
`;

export const hoverActionNegativeSpacingCss = css`
  padding: 0.75rem;
  margin: -0.75rem;
`;

export const hoverActionCss = css`
  border-radius: 0.5rem;

  ${hoverTransition()}

  &:hover {
    background-color: ${ACTION_ACTIVE_COLOR};
  }
`;

export const hoverActionCssWithCustomColor = (color: string) => css`
  border-radius: 0.5rem;

  ${hoverTransition()}

  &:hover {
    background-color: ${color};
  }
`;
