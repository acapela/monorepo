import { forwardRef, ReactNode } from "react";
import styled, { css } from "styled-components";
import { useSharedRef } from "~shared/hooks/useSharedRef";
import { Tooltip } from "~ui/popovers/Tooltip";
import { hoverActionActiveCss, hoverActionCss } from "~ui/transitions";

interface Props {
  icon: ReactNode;
  label?: string;
  isActive?: boolean;
  onClick?: () => void;
  tooltipLabel?: string;
}

export const ToolbarButton = forwardRef<HTMLButtonElement, Props>(function ToolbarButton(
  { icon, isActive = false, onClick, tooltipLabel }: Props,
  ref
) {
  const innerRef = useSharedRef<HTMLButtonElement | null>(null, [ref]);

  const buttonNode = (
    <UIHolder ref={innerRef} isActive={isActive} onClickCapture={onClick}>
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

const UIHolder = styled.button<{ isActive: boolean }>`
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

    ${(props) => {
      if (props.isActive) {
        return css`
          ${hoverActionActiveCss};
          color: #000;

          &:hover {
            color: #000;
          }
        `;
      }

      return css`
        &:hover {
          color: inherit;
        }
      `;
    }}
  }
`;
