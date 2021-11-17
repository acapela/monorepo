import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";
import styled, { css } from "styled-components";

import { styledForwardRef } from "~shared/component";
import { theme } from "~ui/theme";

export interface ButtonDisabledInfo {
  reason: string;
}

export interface ButtonProps extends HTMLMotionProps<"button"> {
  isWide?: boolean;
  kind?: TextButtonKind;
  inline?: boolean;
  onClick?: () => void;
  isDisabled?: boolean;
}

export const TextButton = styledForwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { isWide, inline, isDisabled, children, kind = "secondary", onClick, ...htmlProps },
  ref
) {
  return (
    <UIButton
      ref={ref}
      $kind={kind}
      $isWide={isWide}
      $isDisabled={isDisabled}
      $inline={inline}
      onClick={onClick}
      disabled={isDisabled}
      {...htmlProps}
    >
      {children}
    </UIButton>
  );
})``;

const kindStyles = {
  primary: css`
    ${theme.typo.content};
    ${theme.colors.action.primary.asColor};
    text-decoration: underline;
    ${theme.transitions.hover("color")};

    &:not([disabled]):hover {
      color: ${theme.colors.action.primary.active};
    }
  `,
  secondary: css`
    ${theme.typo.label};
    opacity: 0.4;
    ${theme.transitions.hover("opacity")};

    &:not([disabled]):hover {
      opacity: 0.6;
    }
  `,
};

type TextButtonKind = keyof typeof kindStyles;

export const UIButton = styled(motion.button)<{
  $kind: TextButtonKind;
  $isWide?: boolean;
  $isDisabled?: boolean;
  $inline?: boolean;
}>`
  border: none;
  background: transparent;
  display: inline-flex;
  justify-content: center;
  ${theme.box.label}
  text-align: center;
  cursor: pointer;

  ${(props) =>
    props.$isWide &&
    css`
      width: 100%;
    `}

  ${(props) => kindStyles[props.$kind]}

  ${(props) =>
    props.$inline &&
    css`
      padding: 0;
    `}

  ${(props) =>
    props.$isDisabled &&
    css`
      cursor: unset;
      opacity: 0.5;
    `}
`;
