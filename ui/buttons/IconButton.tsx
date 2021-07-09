import styled, { css } from "styled-components";
import { getButtonColorStyles, hoverActionCss } from "../transitions";
import { ReactNode, forwardRef } from "react";
import { borderRadius } from "~ui/baseStyles";
import { BACKGROUND_ACCENT_WEAK, BUTTON_BACKGROUND_COLOR } from "~ui/colors";

type ActionType = "primary" | "secondary" | "tertiary";

interface Props {
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
  type?: ActionType;
}

export const IconButton = styled(
  forwardRef<HTMLButtonElement, Props>(function IconButton(
    { icon, onClick, className, tooltip, type = "secondary" },
    ref
  ) {
    return (
      <UIHolder ref={ref} data-tooltip={tooltip} onClick={onClick} className={className} actionType={type}>
        <UIIconHolder>{icon}</UIIconHolder>
      </UIHolder>
    );
  })
)``;

const UIHolder = styled.button<{ actionType: ActionType }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 1.5em;
  height: 1.5em;

  ${borderRadius.circle}

  border: none;
  cursor: pointer;

  color: inherit;

  font-size: 1.5rem;

  ${(props) => {
    if (props.actionType === "primary") {
      return getButtonColorStyles(BUTTON_BACKGROUND_COLOR);
    } else if (props.actionType === "tertiary") {
      return getButtonColorStyles(BACKGROUND_ACCENT_WEAK);
    }
    return css`
      background-color: transparent;
      ${hoverActionCss}
    `;
  }}

  svg {
    font-size: 1em;
  }
`;

const UIIconHolder = styled.div``;
