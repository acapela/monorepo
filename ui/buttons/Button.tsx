import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, ReactNode } from "react";
import styled, { css } from "styled-components";
import { disabledOpacityCss } from "~ui/disabled";
import { fontSize } from "../baseStyles";
import { hoverActionCssWithCustomColor } from "../transitions";

export type ButtonIconPosition = "start" | "end";

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
}

export const Button = styled(
  forwardRef<HTMLButtonElement, Props>(function Button(
    { isLoading, isDisabled, isWide, icon, tooltip, iconPosition = "end", children, ...htmlProps },
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

export const UIButton = styled(motion.button)<Props & { isClickable: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font: inherit;
  font-size: ${fontSize.copy};
  font-weight: 600;
  color: #fff;

  background: #474f5a;
  border-radius: 0.5rem;

  ${(props) => (props.isDisabled || props.isLoading) && disabledOpacityCss};

  ${(props) =>
    // Enable hover effect and pointer cursor only if button is clickable (has onClick)
    props.isClickable &&
    css`
      ${hoverActionCssWithCustomColor("#26313E")};
      cursor: ${props.isLoading ? "wait" : "pointer"};
    `}

  ${(props) =>
    props.isWide &&
    css`
      display: block;
      width: 100%;
    `}
`;

const UIContentHolder = styled.div`
  display: flex;
  align-items: center;
`;

const UIIconHolder = styled.div`
  font-size: 1.5em;
  margin-top: -0.5em;
  margin-bottom: -0.5em;

  &:first-child {
    margin-right: 0.25em;
  }

  &:last-child {
    margin-left: 0.25em;
  }
`;

function removeProps<T extends Record<string, any>>(input: T, listOfPropsToRemove: Array<keyof T>) {
  const clone = { ...input };

  for (const propToRemove of listOfPropsToRemove) {
    Reflect.deleteProperty(clone, propToRemove);
  }

  return clone;
}
