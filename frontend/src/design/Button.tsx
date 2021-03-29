import React, { MouseEventHandler } from "react";
import styled from "styled-components";

const PureButton = ({
  id,
  loading,
  disabled,
  className,
  children,
  onClick,
  type = ButtonType.BUTTON,
}: {
  id?: string;
  block?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: ButtonType;
  variant?: ButtonVariant;
}) => {
  const isDisabled = loading || disabled;

  // TODO: add loader style
  return (
    <button id={id} type={type} className={className} onClick={onClick} disabled={isDisabled}>
      {children}
    </button>
  );
};

export enum ButtonType {
  BUTTON = "button",
  SUBMIT = "submit",
}

export enum ButtonVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
}

PureButton.Type = ButtonType;

export const Button = styled(PureButton)`
  border-radius: 0.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-weight: 600;

  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  transition-duration: 150ms;

  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate3d(var(--tw-translate-x), var(--tw-translate-y), 0) rotate(var(--tw-rotate))
    skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));

  --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);

  --tw-ring-offset-width: 2px;

  ${({ block }) =>
    block &&
    `
    display: block;
    width: 100%;
  `}

  ${({ loading, disabled }) =>
    (loading || disabled) &&
    `
    opacity: 0.5;
  `}
  
  ${({ loading }) =>
    loading &&
    `
    cursor: not-allowed;
  `}
  
  ${({ variant }) => {
    if (variant === ButtonVariant.PRIMARY) {
      return `
        --tw-bg-opacity: 1;
        background-color: rgba(59, 130, 246, var(--tw-bg-opacity));
        --tw-text-opacity: 1;
        color: rgba(255, 255, 255, var(--tw-text-opacity));
        --tw-ring-color: rgba(59, 130, 246, var(--tw-ring-opacity));
      `;
    }
    if (variant === ButtonVariant.SECONDARY) {
      return `
      --tw-bg-opacity: 1;
      background-color: rgba(255, 255, 255, var(--tw-bg-opacity));
      border-width: 1px;
      --tw-border-opacity: 1;
      border-color: rgba(229, 231, 235, var(--tw-border-opacity));
      --tw-ring-color: rgba(229, 231, 235, var(--tw-ring-opacity));
    `;
    }
  }}

  &:hover {
    --tw-translate-y: -0.125rem;
    --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  &:active {
    --tw-translate-y: 0px;
  }

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  &:focus-visible {
    box-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  }
`;
