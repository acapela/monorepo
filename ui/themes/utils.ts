import { css } from "styled-components";
import { hoverTransition } from "../transitions";
import { InteractiveAction, Theme } from "./theme";

// Proof of concept

interface Props {
  theme: Theme;
}

export const activeColor = (props: Props) => props.theme.colors.interactive.active;

export const errorColor = (props: Props) => props.theme.colors.status.error;

export const warningColor = (props: Props) => {
  return props.theme.colors.status.warning;
};

export function getActionColorStyles(actionType: InteractiveAction) {
  return function getButtonColorStylesFromTheme(props: Props) {
    const backgroundColor = props.theme.colors.interactive.actions[actionType].background;
    const hoverColor = props.theme.colors.interactive.actions[actionType].hover;
    const activeColor = props.theme.colors.interactive.active;
    const textColor = props.theme.colors.interactive.actions[actionType].text;

    return css`
      ${hoverTransition()}
      background-color: ${backgroundColor};
      color: ${textColor};

      &:hover {
        background-color: ${hoverColor};
        color: ${textColor};
      }

      &:active {
        background-color: ${activeColor};
        color: ${textColor};
      }
    `;
  };
}
