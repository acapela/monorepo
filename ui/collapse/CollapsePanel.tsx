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
  initialIsOpened?: boolean;
  persistanceKey?: string;
  headerNode: ReactNode;
  children: ReactNode;
}

const closedPanelsPersistanceInfo = createLocalStorageValueManager<Record<string, boolean>>("closed-panels", {});

export function CollapsePanel({ initialIsOpened = false, persistanceKey, headerNode, children }: Props) {
  const [isOpened, setIsOpened] = useState(initialIsOpened);
  const holderRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!persistanceKey) return;

    const persistedIsOpened = closedPanelsPersistanceInfo.get()[persistanceKey];

    if (persistedIsOpened === undefined) return;

    setIsOpened(persistedIsOpened);
  }, [persistanceKey]);

  useDependencyChangeEffect(() => {
    if (!persistanceKey) return;

    closedPanelsPersistanceInfo.update((closeInfo) => {
      closeInfo[persistanceKey] = isOpened;
    });
  }, [isOpened]);

  const isHovered = useIsElementOrChildHovered(holderRef);

  useShortcut(
    "Space",
    () => {
      // If anything is focused, don't use space for toggling
      if (getFocusedElement()) {
        return;
      }

      setIsOpened(!isOpened);
    },
    { isEnabled: isHovered }
  );

  return (
    <UIHolder ref={holderRef}>
      <UIHead onClick={() => setIsOpened(!isOpened)}>
        <UIToggleIcon>
          <CollapseToggleButton isOpened={isOpened} onToggle={() => setIsOpened(!isOpened)} />
        </UIToggleIcon>
        <UIHeadContent>{headerNode}</UIHeadContent>
      </UIHead>
      {isOpened && <UIContent>{children}</UIContent>}
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
