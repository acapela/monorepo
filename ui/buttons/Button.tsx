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

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { isLoading, isDisabled, isWide, icon, iconPosition = "end", children, ...htmlProps },
  ref
) {
  const iconNode = icon && <UIIconHolder>{icon}</UIIconHolder>;
  return (
    <UIButton ref={ref} isLoading={isLoading} isDisabled={isDisabled} isWide={isWide} {...htmlProps}>
      {iconPosition === "start" && iconNode}
      {/* We wrap it in span so icon can detect weather it is :last-child or :first-child for spacing */}
      <span>{children}</span>
      {iconPosition === "end" && iconNode}
    </UIButton>
  );
});

export const UIButton = styled(motion.button)<Props>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font: inherit;
  font-size: ${fontSize.copy};
  font-weight: 600;
  color: #fff;
  opacity: ${(props) => (props.isLoading ? 0.5 : 1)};
  cursor: ${(props) => (props.isLoading ? "wait" : "pointer")};
  background: #474f5a;
  border-radius: 0.5rem;

  ${hoverActionCssWithCustomColor("#26313E")}

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
