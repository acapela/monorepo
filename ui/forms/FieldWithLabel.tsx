import { LayoutGroup, motion } from "framer-motion";
import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

import { useId } from "@aca/shared/id";
import { namedForwardRef } from "@aca/shared/react/namedForwardRef";
import { POP_ANIMATION_CONFIG } from "@aca/ui/animations";
import { IconChevronDown } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

type CursorType = "action" | "input";
export interface Props {
  pushLabel?: boolean;
  hasError?: boolean;
  isDisabled?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  label?: string;
  onClick?: () => void;
  indicateDropdown?: boolean;
  cursorType?: CursorType;
}
export const FieldWithLabel = namedForwardRef<HTMLDivElement, Props>(function FieldWithLabel(
  { pushLabel, icon, label, children, onClick, indicateDropdown, cursorType = "input", hasError = false },
  forwardedRef
) {
  const id = useId();

  return (
    <LayoutGroup>
      <UIHolder className="FOOBAR" onClick={onClick} ref={forwardedRef} cursorType={cursorType} hasError={hasError}>
        {icon && <UIIconHolder>{icon}</UIIconHolder>}
        <UIContentHolder>
          <UIFlyingOverlay>
            {label && (
              <UIPlaceholdersHolder>
                {!pushLabel && (
                  <UIPlaceholder key="not-focused" layoutId={id} layout transition={POP_ANIMATION_CONFIG}>
                    {label}
                  </UIPlaceholder>
                )}
                {pushLabel && (
                  <UIFocusedPlaceholder key="focused" layoutId={id} layout transition={POP_ANIMATION_CONFIG}>
                    {label}
                  </UIFocusedPlaceholder>
                )}
              </UIPlaceholdersHolder>
            )}
          </UIFlyingOverlay>
          {children}
        </UIContentHolder>
        {indicateDropdown && <UIDropdownIcon />}
      </UIHolder>
    </LayoutGroup>
  );
});

const UIHolder = styled.div<{ cursorType: CursorType; hasError: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  padding-left: 16px;
  padding-right: 16px;
  gap: 4px;

  width: 100%;

  ${theme.transitions.hover()}

  ${theme.colors.layout.background.interactive};
  ${(props) =>
    props.hasError
      ? css`
          border: 1px solid ${theme.colors.status.danger.value};
        `
      : css`
          border: 1px solid ${theme.colors.layout.background.border};
        `}
  box-sizing: border-box;
  ${theme.radius.secondaryItem};

  outline: none;
  min-height: 16px;

  ${(props) => {
    const { cursorType } = props;

    if (cursorType === "input")
      return css`
        cursor: text;
      `;

    return theme.common.clickable;
  }}
`;

const UIFlyingOverlay = styled.div<{}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: stretch;
  pointer-events: none;
`;

const UIIconHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  padding: 16px;
  padding-left: 0;
  font-size: 20px;
`;

const UIPlaceholdersHolder = styled.div<{}>`
  display: flex;
  max-width: 100%;
`;

const sharedPlaceholderStyles = css`
  will-change: transform;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis; /* This is to avoid bottom of letters like jg to be hidden by overflow: hidden */
  height: 1.5em;
  ${theme.font.secondary};
  ${theme.colors.layout.background.asBgWithReadableText}
`;

const UIPlaceholder = styled(motion.div)<{}>`
  ${sharedPlaceholderStyles}
  display: flex;
  align-items: center;
  align-self: center;
`;
const UIFocusedPlaceholder = styled(motion.div)<{}>`
  ${sharedPlaceholderStyles}
  align-self: flex-start;
  font-size: 12px;

  /* Move it up by half of its height and border to be 'crossing' the top border in the middle of its height */
  margin-top: calc(-0.75em + 2px);
`;

const UIContentHolder = styled.div<{}>`
  position: relative;
  flex-grow: 1;
  min-width: 0;
  display: flex;
`;

const UIDropdownIcon = styled(IconChevronDown)<{}>`
  font-size: 1.5rem;
  opacity: 0.6;
  align-self: center;
  ${theme.common.clickable}
`;
