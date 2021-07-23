import { theme } from "~ui/theme2/theme";
import { HTMLMotionProps } from "framer-motion";
import { forwardRef, ReactNode } from "react";
import { motion } from "framer-motion";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";
import { shadow } from "~ui/baseStyles";
import { BASE_GREY_1, BASE_GREY_2, BASE_GREY_3, BASE_GREY_4, BASE_GREY_6, WHITE, PRIMARY_PINK_1 } from "~ui/colors";

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
  size?: ButtonSize;
  kind?: ButtonKind;
}

export const Button = styled(
  forwardRef<HTMLButtonElement, Props>(function Button(
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
        ref={ref}
        as="button"
        isLoading={isLoading}
        isDisabled={isDisabledBoolean}
        isWide={isWide}
        isClickable={isClickable}
        data-tooltip={getTooltipLabel()}
        spezia
        medium
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

const UIIconHolder = styled.div`
  font-size: 1.2rem;
`;

const buttonSizeSpecificStyle: Record<ButtonSize, FlattenSimpleInterpolation> = {
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

const buttonKindSpecificStyle: Record<ButtonKind, FlattenSimpleInterpolation> = {
  primary: css`
    ${theme.colors.actions.primary.interactive("background-color")}
    ${theme.shadow.button}
    color: ${WHITE};
  `,
  secondary: css`
    ${theme.colors.actions.secondary.interactive("background-color")}
    color: ${BASE_GREY_1};
    border: 1.5px solid transparent;
  `,
  outlined: css`
    ${theme.colors.transparent.secondary.interactive("background-color")}

    color: ${BASE_GREY_1};
    border: 1px solid ${BASE_GREY_4};
    ${shadow.button}
  `,
  transparent: css`
    ${theme.colors.transparent.secondary.interactive("background-color")}
    color: ${BASE_GREY_3};
  `,
};

export const activeTransparentButtonStyles = css`
  color: ${BASE_GREY_2};
  background: ${BASE_GREY_6};
  ${UIIconHolder} {
    color: ${PRIMARY_PINK_1};
  }
`;

export const UIButton = styled(motion.button)<Props & { isClickable: boolean; size: ButtonSize; kind: ButtonKind }>`
  ${theme.font.body.spezia.semibold};
  ${theme.transitions.quickHover};
  ${theme.radius.circle};

  display: inline-flex;
  align-items: center;
  justify-content: center;

  line-height: 1.2rem;

  white-space: nowrap;

  cursor: ${(props) => (props.isLoading ? "wait" : props.isClickable ? "pointer" : "initial")};

  ${UIIconHolder} {
    color: inherit;
  }

  ${(props) => (props.isDisabled || props.isLoading) && theme.interactivity.disabled};
  ${(props) =>
    props.isWide &&
    css`
      width: 100%;
    `}

  ${({ size }) => buttonSizeSpecificStyle[size]}
  ${({ kind }) => buttonKindSpecificStyle[kind]}
`;

const UIContentHolder = styled.div`
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
