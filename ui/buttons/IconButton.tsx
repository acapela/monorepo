import styled from "styled-components";
import { getButtonColorStyles, hoverActionCss } from "../transitions";
import { ReactNode, forwardRef } from "react";
import { borderRadius } from "~ui/baseStyles";
import { BUTTON_BACKGROUND_COLOR } from "~ui/colors";

interface Props {
  icon: ReactNode;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
  isPrimary?: boolean;
}

export const IconButton = styled(
  forwardRef<HTMLButtonElement, Props>(function IconButton(
    { icon, onClick, className, tooltip, isPrimary = false },
    ref
  ) {
    return (
      <UIHolder ref={ref} data-tooltip={tooltip} onClick={onClick} className={className} isPrimary={isPrimary}>
        <UIIconHolder>{icon}</UIIconHolder>
      </UIHolder>
    );
  })
)``;

const UIHolder = styled.button<{ isPrimary: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 1.5em;
  height: 1.5em;

  ${borderRadius.button}
  background-color: transparent;
  border: none;
  cursor: pointer;

  color: inherit;

  font-size: 1.5rem;

  ${(props) => {
    if (!props.isPrimary) {
      return hoverActionCss;
    }

    return getButtonColorStyles(BUTTON_BACKGROUND_COLOR);
  }}

  svg {
    font-size: 1em;
  }
`;

const UIIconHolder = styled.div``;
