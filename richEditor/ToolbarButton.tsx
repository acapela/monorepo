import { forwardRef, ReactNode } from "react";
import styled, { css } from "styled-components";
import { ACTIVE_COLOR } from "~ui/colors";
import { hoverActionActiveCss, hoverActionCss } from "~ui/transitions";

interface Props {
  icon: ReactNode;
  label?: string;
  isHighlighted?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  tooltipLabel?: string;
}

export const ToolbarButton = forwardRef<HTMLButtonElement, Props>(function ToolbarButton(
  { icon, isHighlighted = false, isDisabled = false, onClick, tooltipLabel }: Props,
  ref
) {
  const buttonNode = (
    <UIHolder
      data-tooltip={tooltipLabel}
      isActive={isHighlighted}
      isDisabled={isDisabled}
      onClickCapture={onClick}
      ref={ref}
    >
      {icon}
    </UIHolder>
  );

  return <>{buttonNode}</>;
});

const UIHolder = styled.button<{ isActive: boolean; isDisabled: boolean }>`
  /* Make sure our styles overwrite Quill theme */
  &&& {
    all: unset;
    font-size: 1.5rem;
    height: 1.5em;
    width: 1.5em;
    display: flex;
    align-items: center;
    justify-content: center;

    ${hoverActionCss}

    ${(props) =>
      props.isDisabled &&
      css`
        opacity: 0.4;
        pointer-events: none;
      `}

    ${(props) => {
      if (props.isActive) {
        return css`
          ${hoverActionActiveCss};
          color: #fff;
          background-color: ${ACTIVE_COLOR};

          &:hover {
            color: #fff;
            background-color: ${ACTIVE_COLOR};
          }
        `;
      }

      return css`
        &:hover {
          color: #222;
        }
      `;
    }}
  }
`;
