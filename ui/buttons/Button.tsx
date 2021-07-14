import { HTMLMotionProps } from "framer-motion";
import { forwardRef, ReactNode } from "react";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { disabledOpacityCss } from "~ui/disabled";
import { borderRadius, shadow } from "~ui/baseStyles";
import { hoverTransition } from "~ui/transitions";
import {
  BASE_GREY_1,
  BASE_GREY_2,
  BASE_GREY_3,
  BASE_GREY_4,
  BASE_GREY_6,
  BUTTON_BACKGROUND_COLOR,
  BUTTON_BACKGROUND_ACTIVE_COLOR,
  WHITE,
  PRIMARY_PINK_1,
  BASE_GREY_LINES,
} from "~ui/colors";
import { TextBody } from "~ui/typo";

export type ButtonIconPosition = "start" | "end";

export interface ButtonDisabledInfo {
  reason: string;
}

type ButtonSize = "small" | "medium" | "large";
type ButtonKind = "primary" | "secondary" | "outlined" | "transparent";

interface Props extends HTMLMotionProps<"button"> {
  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;
  isLoading?: boolean;
  isDisabled?: boolean | ButtonDisabledInfo;
  isWide?: boolean;
  tooltip?: string;
  size?: ButtonSize;
  kind?: ButtonKind;
}

export const Button = styled(
  forwardRef<HTMLButtonElement, Props>(function Button(
    {
      isLoading,
      isDisabled,
      isWide,
      icon,
      tooltip,
      iconPosition = "end",
      size = "medium",
      kind = "primary",
      children,
      ...htmlProps
    },
    ref
  ) {
    const iconNode = icon && <UIIconHolder>{icon}</UIIconHolder>;
    const isClickable = !!htmlProps.onClick && !isDisabled;

    const isDisabledBoolean = !!isDisabled;

    function getTooltipLabel() {
      if (isDisabled && typeof isDisabled !== "boolean") {
        return isDisabled.reason;
      }

      return tooltip ?? null;
    }

    const finalProps = isClickable ? htmlProps : removeProps(htmlProps, ["onClick"]);

    return (
      <UIButton
        ref={ref}
        as="button"
        isLoading={isLoading}
        isDisabled={isDisabledBoolean}
        isWide={isWide}
        isClickable={isClickable}
        data-tooltip={getTooltipLabel()}
        spezia
        medium
        size={size}
        kind={kind}
        {...finalProps}
      >
        {iconPosition === "start" && iconNode}
        {/* We wrap it in span so icon can detect weather it is :last-child or :first-child for spacing */}
        <UIContentHolder>{children}</UIContentHolder>
        {iconPosition === "end" && iconNode}
      </UIButton>
    );
  })
)``;

const UIIconHolder = styled.div`
  font-size: 1.2rem;
`;

const buttonSizeSpecificStyle: Record<ButtonSize, FlattenSimpleInterpolation> = {
  small: css`
    font-size: 12px;
    padding: 10px 8px;
    gap: 4px;
  `,
  medium: css`
    font-size: 14px;
    padding: 12px;
    gap: 8px;
  `,
  large: css`
    font-size: 16px;
    padding: 18px 16px;
    gap: 8px;
  `,
};

const buttonKindSpecificStyle: Record<ButtonKind, FlattenSimpleInterpolation> = {
  primary: css`
    background: ${BUTTON_BACKGROUND_COLOR};
    color: ${WHITE};
    ${shadow.button}

    ${UIIconHolder} {
      color: ${BASE_GREY_4};
    }
  `,
  secondary: css`
    background: ${BASE_GREY_6};
    color: ${BASE_GREY_1};
    border: 1.5px solid transparent;

    ${UIIconHolder} {
      color: ${BASE_GREY_2};
    }
  `,
  outlined: css`
    background: ${WHITE};
    color: ${BASE_GREY_1};
    border: 1px solid ${BASE_GREY_4};
    ${shadow.button}

    ${UIIconHolder} {
      color: ${PRIMARY_PINK_1};
    }
  `,
  transparent: css`
    background: transparent;
    color: ${BASE_GREY_3};

    ${UIIconHolder} {
      color: ${BASE_GREY_3};
    }
  `,
};

export const activeTransparentButtonStyles = css`
  color: ${BASE_GREY_2};
  background: ${BASE_GREY_6};
  ${UIIconHolder} {
    color: ${PRIMARY_PINK_1};
  }
`;

const buttonKindSpecificInteractionStyle: Record<ButtonKind, FlattenSimpleInterpolation> = {
  primary: css`
    &:hover {
      background: ${BUTTON_BACKGROUND_ACTIVE_COLOR};
    }
    &:active {
      background: ${BUTTON_BACKGROUND_ACTIVE_COLOR};
    }
  `,
  secondary: css`
    &:hover {
      background: ${BASE_GREY_4};
    }
    &:active {
      background: ${BASE_GREY_LINES};
      border-color: ${PRIMARY_PINK_1};
    }
  `,
  outlined: css`
    &:hover {
      background: ${BASE_GREY_6};
    }
    &:active {
      background: ${BASE_GREY_6};
    }
  `,
  transparent: css`
    &:hover {
      color: ${BASE_GREY_2};
      background: ${BASE_GREY_6};
    }
    &:active {
      ${activeTransparentButtonStyles};
    }

    &:hover ${UIIconHolder} {
      color: ${PRIMARY_PINK_1};
    }
  `,
};

export const UIButton = styled(TextBody)<Props & { isClickable: boolean; size: ButtonSize; kind: ButtonKind }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  font: inherit;
  font-weight: 400;
  line-height: 1.2rem;
  cursor: ${(props) => (props.isLoading ? "wait" : props.isClickable ? "pointer" : "initial")};

  ${hoverTransition()}

  ${borderRadius.circle}

  ${(props) => (props.isDisabled || props.isLoading) && disabledOpacityCss};
  ${(props) =>
    props.isWide &&
    css`
      width: 100%;
    `}

  ${({ size }) => buttonSizeSpecificStyle[size]}
  ${({ kind }) => buttonKindSpecificStyle[kind]}
  ${({ isClickable, kind }) => isClickable && buttonKindSpecificInteractionStyle[kind]}
`;

const UIContentHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function removeProps<T extends Record<string, any>>(input: T, listOfPropsToRemove: Array<keyof T>) {
  const clone = { ...input };

  for (const propToRemove of listOfPropsToRemove) {
    Reflect.deleteProperty(clone, propToRemove);
  }

  return clone;
}
