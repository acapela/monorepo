import classNames, { ClassValue } from "classnames";
import { MouseEventHandler } from "react";

const baseClassNames =
  "rounded-lg px-6 py-2 transition ease-out duration-150 transform-gpu hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg font-semibold focus:outline-none focus-visible:ring-2 ring-offset-2";

export const Button = ({
  id,
  block,
  loading,
  disabled,
  className: classNameOverrides,
  children,
  onClick,
  type = ButtonType.BUTTON,
  variant = ButtonVariant.SECONDARY,
}: {
  id?: string;
  block?: boolean;
  loading?: boolean;
  disabled?: boolean;
  className?: ClassValue;
  children?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: ButtonType;
  variant?: ButtonVariant;
}) => {
  const isDisabled = loading || disabled;
  const buttonClass = classNames(
    baseClassNames,
    {
      "w-full display-block": block,
      "opacity-50": isDisabled,
      "cursor-not-allowed": disabled,
    },
    {
      "bg-blue-500 text-white ring-blue-500": variant === ButtonVariant.PRIMARY,
      "bg-white border border-gray-200 ring-gray-200": variant === ButtonVariant.SECONDARY,
    },
    classNameOverrides
  );
  // TODO: add loader style
  return (
    <button id={id} type={type} className={buttonClass} onClick={onClick} disabled={isDisabled}>
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

Button.Type = ButtonType;
