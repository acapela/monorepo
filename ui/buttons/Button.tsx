import { HTMLMotionProps, motion } from "framer-motion";
import { ReactNode } from "react";
import styled, { css } from "styled-components";

import { styledForwardRef } from "~shared/component";
import { disabledOpacityCss } from "~ui/disabled";
import { theme } from "~ui/theme";

import { ButtonKind, getButtonKindtyles } from "./variants";

export interface ButtonDisabledInfo {
  reason: string;
}

interface Props extends HTMLMotionProps<"button"> {
  icon?: ReactNode;
  iconAtStart?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean | ButtonDisabledInfo;
  isWide?: boolean;
  tooltip?: string;
  kind?: ButtonKind;
}

export const Button = styledForwardRef<HTMLButtonElement, Props>(function Button(
  { isLoading, isDisabled, isWide, icon, tooltip, iconAtStart = true, kind = "secondary", children, ...htmlProps },
  ref
) {
  const iconNode = icon && <UIIconHolder>{icon}</UIIconHolder>;

  const isDisabledBoolean = !!isDisabled;

  function getTooltipLabel() {
    if (isDisabled && typeof isDisabled !== "boolean") {
      return isDisabled.reason;
    }

    return tooltip ?? null;
  }

  return (
    <UIButton
      ref={ref}
      isLoading={isLoading}
      isDisabled={isDisabledBoolean}
      disabled={isDisabledBoolean}
      isWide={isWide}
      data-tooltip={getTooltipLabel()}
      kind={kind}
      {...htmlProps}
    >
      {iconAtStart && iconNode}
      {children && <UIContentHolder>{children}</UIContentHolder>}
      {!iconAtStart && iconNode}
    </UIButton>
  );
})``;

const UIIconHolder = styled.div<{}>`
  font-size: 1.5em;
`;

export const UIButton = styled(motion.button)<Props & { kind: ButtonKind }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  ${theme.typo.content.medium.resetLineHeight};
  ${theme.box.button};
  ${theme.radius.secondaryItem};
  ${theme.spacing.horizontalActions.asGap};

  a & {
    /* It is possible that button is inside <a> tag without having onClick handler. It means it should also have cursor pointer. */
    cursor: pointer;
  }

  ${theme.transitions.hover()}

  ${(props) => getButtonKindtyles(props.kind)}

  ${(props) => (props.isDisabled || props.isLoading) && disabledOpacityCss};
  ${(props) =>
    props.isWide &&
    css`
      width: 100%;
    `}
`;

const UIContentHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: center;
`;
