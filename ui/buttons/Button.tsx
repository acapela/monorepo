import { HTMLMotionProps, motion } from "framer-motion";
import { ForwardedRef, forwardRef, ReactNode } from "react";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { shadow } from "~ui/baseStyles";
import { disabledOpacityCss } from "~ui/disabled";
import { theme } from "~ui/theme";
import { ButtonIconPosition, ButtonKind, ButtonSize } from "./types";

export interface ButtonDisabledInfo {
  reason: string;
}

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as ForwardedRef<any>}
        isLoading={isLoading}
        isDisabled={isDisabledBoolean}
        isWide={isWide}
        isClickable={isClickable}
        data-tooltip={getTooltipLabel()}
        size={size}
        kind={kind}
        {...finalProps}
      >
        {iconPosition === "start" && iconNode}
        <UIContentHolder>{children}</UIContentHolder>
        {iconPosition === "end" && iconNode}
      </UIButton>
    );
  })
)``;

const UIIconHolder = styled.div``;

export const smallSizeButtonStyle = css`
  font-size: 12px;
  padding: 10px 8px;
  gap: 4px;
`;

const buttonSizeSpecificStyle: Partial<Record<ButtonSize, FlattenSimpleInterpolation>> = {
  small: smallSizeButtonStyle,
  medium: css`
    font-size: 14px;
    padding: 12px;
    gap: 8px;

    ${UIIconHolder} {
      /* specific font size to match the design */
      font-size: 1.14;
    }
  `,
  large: css`
    font-size: 16px;
    padding: 18px 16px;
    gap: 8px;

    ${UIIconHolder} {
      /* specific font size to match the design */
      font-size: 1.25;
    }
  `,
};

export const activeTransparentButtonStyles = css`
  color: ${theme.colors.layout.bodyText};
  background: ${theme.colors.interactive.selected};

  svg {
    color: ${theme.colors.interactive.active};
  }
`;

const buttonKindSpecificStyle: Partial<Record<ButtonKind, FlattenSimpleInterpolation>> = {
  primary: css`
    ${theme.colors.actions.primary.all()}
    ${shadow.button}
  `,
  secondary: css`
    border-style: solid;
    border-width: 1.5px;

    ${theme.colors.actions.secondary.all()}
    ${shadow.button}
  `,
  tertiary: css`
    ${theme.colors.actions.tertiary.all()}
    ${shadow.button}
  `,

  // TODO: Remove most transparent buttons and create a new component for remaining non-button components
  transparent: css`
    ${theme.font.inter.normal.build}

    background: transparent;
    color: ${theme.colors.layout.supportingText};

    svg {
      color: ${theme.colors.layout.supportingText};
    }

    &:hover {
      color: ${theme.colors.layout.bodyText};
      background: ${theme.colors.interactive.selected};
      svg {
        color: ${theme.colors.layout.bodyText};
      }
    }

    &:active {
      ${activeTransparentButtonStyles};
    }
  `,
};

export const UIButton = styled(motion.button)<Props & { isClickable: boolean; size: ButtonSize; kind: ButtonKind }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  ${theme.font.body.spezia.medium.withExceptionalLineHeight("1.2", "Line height for buttons").build}

  cursor: ${(props) => (props.isLoading ? "wait" : props.isClickable ? "pointer" : "initial")};

  ${theme.transitions.hover()}

  ${theme.borderRadius.circle}

  ${(props) => (props.isDisabled || props.isLoading) && disabledOpacityCss};
  ${(props) =>
    props.isWide &&
    css`
      width: 100%;
    `}

  ${({ size }) => buttonSizeSpecificStyle[size]}
  ${({ kind }) => buttonKindSpecificStyle[kind]}
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
