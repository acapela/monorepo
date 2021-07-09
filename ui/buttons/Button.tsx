import { HTMLMotionProps } from "framer-motion";
import { forwardRef, ReactNode } from "react";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { disabledOpacityCss } from "~ui/disabled";
import { borderRadius } from "~ui/baseStyles";
import { hoverTransition } from "~ui/transitions";
import { BASE_GREY_4, BUTTON_BACKGROUND_COLOR, BUTTON_BACKGROUND_ACTIVE_COLOR, WHITE } from "~ui/colors";
import { TextBody } from "~ui/typo";

export type ButtonIconPosition = "start" | "end";

export interface ButtonDisabledInfo {
  reason: string;
}

type ButtonSize = "small" | "medium" | "large";

interface Props extends HTMLMotionProps<"button"> {
  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;
  isLoading?: boolean;
  isDisabled?: boolean | ButtonDisabledInfo;
  isWide?: boolean;
  tooltip?: string;
  size?: ButtonSize;
}

export const Button = styled(
  forwardRef<HTMLButtonElement, Props>(function Button(
    { isLoading, isDisabled, isWide, icon, tooltip, iconPosition = "end", size = "medium", children, ...htmlProps },
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
        isLoading={isLoading}
        isDisabled={isDisabledBoolean}
        isWide={isWide}
        isClickable={isClickable}
        data-tooltip={getTooltipLabel()}
        spezia
        medium
        size={size}
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

const buttonSizeSpecificStyle: { [key in ButtonSize]: FlattenSimpleInterpolation } = {
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

export const UIButton = styled(TextBody)<Props & { isClickable: boolean; size: ButtonSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  font: inherit;
  font-weight: 400;
  line-height: 1.2rem;
  color: ${WHITE};

  ${hoverTransition()}
  background: ${BUTTON_BACKGROUND_COLOR};
  &:active {
    background: ${BUTTON_BACKGROUND_ACTIVE_COLOR};
  }
  &:hover {
    background: ${BUTTON_BACKGROUND_ACTIVE_COLOR};
  }

  ${borderRadius.circle}
  ${(props) => (props.isDisabled || props.isLoading) && disabledOpacityCss};
  ${(props) =>
    // Enable hover effect and pointer cursor only if button is clickable (has onClick)
    props.isClickable &&
    css`
      cursor: ${props.isLoading ? "wait" : "pointer"};
    `}
  ${(props) =>
    props.isWide &&
    css`
      width: 100%;
    `}

  ${({ size }) => buttonSizeSpecificStyle[size]}
`;

const UIContentHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UIIconHolder = styled.div`
  font-size: 1.2rem;
  color: ${BASE_GREY_4};
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function removeProps<T extends Record<string, any>>(input: T, listOfPropsToRemove: Array<keyof T>) {
  const clone = { ...input };

  for (const propToRemove of listOfPropsToRemove) {
    Reflect.deleteProperty(clone, propToRemove);
  }

  return clone;
}
