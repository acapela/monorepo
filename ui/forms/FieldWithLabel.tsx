import { AnimateSharedLayout, motion } from "framer-motion";
import { ReactNode } from "react";
import styled from "styled-components";
import { useId } from "~shared/id";
import { POP_ANIMATION_CONFIG } from "~ui/animations";
import { borderRadius } from "~ui/baseStyles";
import { IconChevronDown } from "~ui/icons";

export interface Props {
  pushLabel?: boolean;
  hasError?: boolean;
  isDisabled?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  label?: string;
  onClick?: () => void;
  indicateDropdown?: boolean;
}

export function FieldWithLabel({
  pushLabel,
  hasError,
  isDisabled,
  icon,
  label,
  children,
  onClick,
  indicateDropdown,
}: Props) {
  const id = useId();

  return (
    <AnimateSharedLayout>
      <UIHolder onClick={onClick}>
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
}

const UIHolder = styled.div`
  position: relative;
  display: flex;
  display: flex;
  flex-direction: row;
  align-items: stretch;

  width: 100%;

  border: 1px solid hsla(0, 0%, 75%, 0.25);
  box-sizing: border-box;
  ${borderRadius.input}

  outline: none;
  min-height: 16px;
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
  font-size: 20px;
`;

const UIPlaceholdersHolder = styled.div`
  display: flex;
  opacity: 0.6;
`;

const UIPlaceholder = styled(motion.div)`
  display: flex;
  align-items: center;
  align-self: center;
  will-change: transform;
`;
const UIFocusedPlaceholder = styled(motion.div)`
  align-self: flex-start;
  margin-top: calc(-0.5em + 1px);
  font-size: 12px;
  background-color: #fff;
  will-change: transform;
  opacity: 0.6;
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
