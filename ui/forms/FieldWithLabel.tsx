import { AnimateSharedLayout, motion } from "framer-motion";
import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { useId } from "~shared/id";
import { POP_ANIMATION_CONFIG } from "~ui/animations";
import { borderRadius } from "~ui/baseStyles";
import { BACKGROUND_ACCENT, SECONDARY_TEXT_COLOR, WHITE } from "~ui/theme/colors/base";
import { IconChevronDown } from "~ui/icons";
import { namedForwardRef } from "~shared/react/namedForwardRef";

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
  { pushLabel, icon, label, children, onClick, indicateDropdown, cursorType = "input" },
  forwardedRef
) {
  const id = useId();

  return (
    <AnimateSharedLayout>
      <UIHolder onClick={onClick} ref={forwardedRef} cursorType={cursorType}>
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
    </AnimateSharedLayout>
  );
});

const UIHolder = styled.div<{ cursorType: CursorType }>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  padding-left: 16px;

  width: 100%;

  border: 1px solid ${BACKGROUND_ACCENT};
  box-sizing: border-box;
  ${borderRadius.input}

  outline: none;
  min-height: 16px;

  /* TODO: add theme.colors.forms and replace it with this */
  background-color: ${WHITE};
  cursor: ${(props) => (props.cursorType === "input" ? "text" : "pointer")};
`;

const UIFlyingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: stretch;
  pointer-events: none;
`;

const UIIconHolder = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  padding-left: 0;
  font-size: 20px;
`;

const UIPlaceholdersHolder = styled.div`
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
  color: ${SECONDARY_TEXT_COLOR};
`;

const UIPlaceholder = styled(motion.div)`
  ${sharedPlaceholderStyles}
  display: flex;
  align-items: center;
  align-self: center;
`;
const UIFocusedPlaceholder = styled(motion.div)`
  ${sharedPlaceholderStyles}
  align-self: flex-start;
  font-size: 12px;
  background-color: #fff;

  /* Move it up by half of its height and border to be 'crossing' the top border in the middle of its height */
  margin-top: calc(-0.75em + 2px);
  box-shadow: 0 0 0px 6px #fff;
`;

const UIContentHolder = styled.div`
  position: relative;
  flex-grow: 1;
  min-width: 0;
  display: flex;
`;

const UIDropdownIcon = styled(IconChevronDown)`
  font-size: 1.5rem;
  opacity: 0.6;
  align-self: center;
  margin-right: 16px;
`;
