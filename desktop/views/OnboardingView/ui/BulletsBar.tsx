import React from "react";
import styled from "styled-components";

import { getObjectKey } from "@aca/shared/object";
import { theme } from "@aca/ui/theme";

interface Props<T> {
  items: T[];
  activeItem: T;
  onActivateRequest: (item: T) => void;
  allowMovingForward?: boolean;
}

export function BulletsBar<T>({ items, activeItem, onActivateRequest, allowMovingForward = false }: Props<T>) {
  const activeItemIndex = items.indexOf(activeItem);
  return (
    <UIHolder>
      {items.map((item, index) => {
        const isActive = item === activeItem;
        const isAfterActive = index > activeItemIndex;
        const isDisabled = !allowMovingForward && isAfterActive;
        return (
          <UIBulletClicker
            key={getObjectKey(item)}
            $isActive={isActive}
            $isDisabled={isDisabled}
            onClick={() => {
              onActivateRequest(item);
            }}
          >
            <UIBullet></UIBullet>
          </UIBulletClicker>
        );
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  justify-content: center;
  height: 60px;
  align-items: stretch;
`;

const BULLET_SIZE = 12;

const UIBulletClicker = styled.div<{ $isActive: boolean; $isDisabled: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px;
  opacity: ${(props) => (props.$isActive ? 0.7 : 0.3)};
  pointer-events: ${(props) => (props.$isDisabled ? "none" : "all")};

  ${theme.transitions.hover()}

  &:hover {
    opacity: ${(props) => (props.$isActive ? 0.7 : 0.5)};
  }

  &:active {
    opacity: 0.7;
  }
`;

const UIBullet = styled.div`
  width: ${BULLET_SIZE}px;
  height: ${BULLET_SIZE}px;
  border-radius: ${BULLET_SIZE}px;
  background-color: ${theme.colors.text.value};
`;
