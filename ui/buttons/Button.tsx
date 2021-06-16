import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef, ReactNode } from "react";
import styled, { css } from "styled-components";
import { fontSize } from "../baseStyles";
import { hoverActionCssWithCustomColor } from "../transitions";

export type ButtonIconPosition = "start" | "end";

interface Props extends HTMLMotionProps<"button"> {
  icon?: ReactNode;
  iconPosition?: ButtonIconPosition;
  isLoading?: boolean;
  isDisabled?: boolean;
  isWide?: boolean;
}

export const Button = styled(
  forwardRef<HTMLButtonElement, Props>(function Button(
    { isLoading, isDisabled, isWide, icon, iconPosition = "end", children, ...htmlProps },
    ref
  ) {
    const iconNode = icon && <UIIconHolder>{icon}</UIIconHolder>;
    const isClickable = !!htmlProps.onClick;
    return (
      <UIButton
        ref={ref}
        isLoading={isLoading}
        isDisabled={isDisabled}
        isWide={isWide}
        isClickable={isClickable}
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

export const UIButton = styled(motion.button)<Props & { isClickable: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font: inherit;
  font-size: ${fontSize.copy};
  font-weight: 600;
  color: #fff;
  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};
  background: #474f5a;
  border-radius: 0.5rem;
  justify-content: center;

  ${(props) =>
    // Enable hover effect and pointer cursor only if button is clickable (has onClick)
    props.isClickable &&
    css`
      ${hoverActionCssWithCustomColor("#26313E")};
      cursor: ${props.isLoading ? "wait" : "pointer"};
    `}

  ${(props) =>
    props.isDisabled &&
    css`
      pointer-events: none;
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
