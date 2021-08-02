import { HTMLMotionProps, motion } from "framer-motion";
import { ForwardedRef, ReactNode } from "react";
import styled, { css } from "styled-components";
import { namedForwardRef } from "~shared/react/namedForwardRef";
import { disabledOpacityCss } from "~ui/disabled";
import { theme } from "~ui/theme";
import { buttonKindSpecificStyle, buttonSizeSpecificStyle } from "./sharedStyles";
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
  namedForwardRef<HTMLButtonElement, Props>(function Button(
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
        disabled={isDisabledBoolean}
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

const UIIconHolder = styled.div<{}>``;

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

const UIContentHolder = styled.div<{}>`
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
