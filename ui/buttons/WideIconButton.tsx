import { forwardRef, ReactNode } from "react";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import {
  BUTTON_BACKGROUND_COLOR,
  BUTTON_BACKGROUND_ACTIVE_COLOR,
  WHITE,
  PRIMARY_PINK_1,
  BASE_GREY_4,
  BASE_GREY_6,
} from "~ui/colors";
import { hoverTransition } from "~ui/transitions";
import { shadow } from "~ui/baseStyles";
import { ButtonKind } from "./types";

interface Props {
  icon: ReactNode;
  kind?: ButtonKind;
  onClick?: () => void;
  tooltip?: string;
}

export const WideIconButton = forwardRef<HTMLButtonElement, Props>(function WideIconButton(
  { icon, kind = "primary", onClick, tooltip }: Props,
  ref
) {
  return (
    <UIButton ref={ref} data-tooltip={tooltip} onClick={onClick} kind={kind}>
      {icon}
    </UIButton>
  );
});

const buttonKindSpecificStyle: Partial<Record<ButtonKind, FlattenSimpleInterpolation>> = {
  primary: css`
    background: ${BUTTON_BACKGROUND_COLOR};
    color: ${WHITE};

    &:hover {
      background: ${BUTTON_BACKGROUND_ACTIVE_COLOR};
    }
    &:active {
      background: ${BUTTON_BACKGROUND_ACTIVE_COLOR};
    }
  `,
  secondary: css`
    background: ${WHITE};
    color: ${PRIMARY_PINK_1};
    border: 1px solid ${BASE_GREY_4};

    &:hover {
      background: ${BASE_GREY_6};
    }
    &:active {
      background: ${BASE_GREY_6};
    }
  `,
};

export const UIButton = styled.button<{ kind: ButtonKind }>`
  width: 40px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  border-radius: 8px;
  font-size: 16px;
  ${shadow.button}

  ${hoverTransition()}

  ${({ kind }) => buttonKindSpecificStyle[kind]}
`;
