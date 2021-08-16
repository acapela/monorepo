import { motion } from "framer-motion";
import { ReactNode, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "react-use";
import styled from "styled-components";

import { getFocusedElement } from "~shared/focus";
import { useDependencyChangeEffect } from "~shared/hooks/useChangeEffect";
import { useIsElementOrChildHovered } from "~shared/hooks/useIsElementOrChildHovered";
import { createLocalStorageValueManager } from "~shared/localStorage";
import { PopPresenceAnimator } from "~ui/animations";
import { CollapseToggleButton } from "~ui/buttons/CollapseToggleButton";
import { useShortcut } from "~ui/keyboard/useShortcut";

interface Props {
  isInitiallyOpen?: boolean;
  persistanceKey?: string;
  headerNode: ReactNode;
  children: ReactNode;
}

const closedPanelsPersistanceInfo = createLocalStorageValueManager<Record<string, boolean>>("closed-panels", {});

export function CollapsePanel({ isInitiallyOpen = false, persistanceKey, headerNode, children }: Props) {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen);
  const holderRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!persistanceKey) return;

    const persistedIsOpen = closedPanelsPersistanceInfo.get()[persistanceKey];

    if (persistedIsOpen === undefined) return;

    setIsOpen(persistedIsOpen);
  }, [persistanceKey]);

  useDependencyChangeEffect(() => {
    if (!persistanceKey) return;

    closedPanelsPersistanceInfo.update((closeInfo) => {
      closeInfo[persistanceKey] = isOpen;
    });
  }, [isOpen]);

  const isHovered = useIsElementOrChildHovered(holderRef);

  useShortcut(
    "Space",
    () => {
      // If anything is focused, don't use space for toggling
      if (getFocusedElement()) {
        return;
      }

      setIsOpen(!isOpen);
    },
    { isEnabled: isHovered }
  );

  return (
    <UIHolder ref={holderRef}>
      <UIHead onClick={() => setIsOpen(!isOpen)}>
        <UIToggleIcon>
          <CollapseToggleButton isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
        </UIToggleIcon>
        <UIHeadContent>{headerNode}</UIHeadContent>
      </UIHead>
      {isOpen && <UIContent>{children}</UIContent>}
    </UIHolder>
  );
}

const UIHolder = styled(motion.div)<{}>``;

const UIHead = styled.div<{}>`
  display: flex;
  align-items: center;

  cursor: pointer;
`;

const UIToggleIcon = styled.div<{}>`
  margin-right: 16px;
`;

const UIHeadContent = styled.div<{}>`
  flex: 1;
  min-width: 0;
`;

const UIContent = styled(PopPresenceAnimator)<{}>`
  margin-top: 4px;
`;
