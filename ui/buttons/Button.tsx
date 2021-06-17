import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, ReactNode } from "react";
import styled, { css } from "styled-components";
import { disabledOpacityCss } from "~ui/disabled";
import { fontSize } from "~ui/baseStyles";
import { BACKGROUND_ACCENT } from "~ui/colors";
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
  kind?: "regular" | "ghost";
}

export const Button = styled(
  forwardRef<HTMLButtonElement, Props>(function Button(
    { isLoading, isDisabled, isWide, icon, tooltip, iconPosition = "end", kind = "regular", children, ...htmlProps },
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
        kind={kind}
        {...htmlProps}
      >
        {iconPosition === "start" && iconNode}
        {/* We wrap it in span so icon can detect weather it is :last-child or :first-child for spacing */}
        <UIContentHolder>{children}</UIContentHolder>
        {iconPosition === "end" && iconNode}
      </UIButton>
    );
  })
)``;

const regularKindCSS = css<Props & { isClickable: boolean }>`
  color: #fff;
  background: #474f5a;
  ${(props) =>
    // Enable hover effect only if button is clickable (has onClick)
    props.isClickable &&
    css`
      ${hoverActionCssWithCustomColor("#26313E")};
    `}
`;

const ghostKindCSS = css<Props & { isClickable: boolean }>`
  color: #474f5a;
  background: transparent;
  border: 1px solid ${BACKGROUND_ACCENT};
  ${(props) =>
    // Enable hover effect only if button is clickable (has onClick)
    props.isClickable &&
    css`
      ${hoverActionCssWithCustomColor(BACKGROUND_ACCENT)};
    `}
`;

export const UIButton = styled(motion.button)<Props & { isClickable: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  font: inherit;
  font-size: ${fontSize.copy};
  font-weight: 600;

  ${(props) => (props.isDisabled || props.isLoading) && disabledOpacityCss};
  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};

  ${(props) => (props.kind === "regular" ? regularKindCSS : ghostKindCSS)};

  border-radius: 0.5rem;

  ${(props) =>
    // Enable pointer cursor only if button is clickable (has onClick)
    props.isClickable &&
    !props.isDisabled &&
    css`
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
  justify-content: center;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function removeProps<T extends Record<string, any>>(input: T, listOfPropsToRemove: Array<keyof T>) {
  const clone = { ...input };

  for (const propToRemove of listOfPropsToRemove) {
    Reflect.deleteProperty(clone, propToRemove);
  }

  return clone;
}
