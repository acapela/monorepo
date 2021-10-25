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
}

export const TextButton = styledForwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { isWide, children, kind = "secondary", onClick, ...htmlProps },
  ref
) {
  return (
    <UIButton ref={ref} kind={kind} isWide={isWide} onClick={onClick} {...htmlProps}>
      {children}
    </UIButton>
  );
})``;

const kindStyles = {
  primary: css`
    ${theme.typo.content};
    color: ${theme.colors.action.primary};
    text-decoration: underline;
    ${theme.transitions.hover("color")};

    &:hover {
      color: ${theme.colors.action.primary.active};
    }
  `,
  secondary: css`
    ${theme.typo.label};
    opacity: 0.4;
    ${theme.transitions.hover("opacity")};

    &:hover {
      opacity: 0.6;
    }
  `,
};

type TextButtonKind = keyof typeof kindStyles;

export const UIButton = styled(motion.button)<{
  kind: TextButtonKind;
  isWide?: boolean;
  inline?: boolean;
}>`
  border: none;
  background: transparent;
  display: inline-flex;
  justify-content: center;
  ${theme.box.label}
  text-align: center;
  cursor: pointer;

  ${(props) =>
    props.isWide &&
    css`
      width: 100%;
    `}

  ${(props) => kindStyles[props.kind]}

  ${(props) =>
    props.inline &&
    css`
      padding: 0;
    `}
`;
