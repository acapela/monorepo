import { forwardRef, ReactNode } from "react";
import styled, { css } from "styled-components";
import { useSharedRef } from "~shared/hooks/useSharedRef";
import { ACTIVE_COLOR } from "~ui/colors";
import { Tooltip } from "~ui/popovers/Tooltip";
import { hoverActionActiveCss, hoverActionCss } from "~ui/transitions";

interface Props {
  icon: ReactNode;
  label?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  tooltipLabel?: string;
}

export const ToolbarButton = forwardRef<HTMLButtonElement, Props>(function ToolbarButton(
  { icon, isActive = false, isDisabled = false, onClick, tooltipLabel }: Props,
  ref
) {
  const innerRef = useSharedRef<HTMLButtonElement | null>(null, [ref]);

  const buttonNode = (
    <UIHolder ref={innerRef} isActive={isActive} isDisabled={isDisabled} onClickCapture={onClick}>
      {icon}
    </UIHolder>
  );

  return (
    <>
      {buttonNode}
      {tooltipLabel && <Tooltip label={tooltipLabel} anchorRef={innerRef} />}
    </>
  );
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
