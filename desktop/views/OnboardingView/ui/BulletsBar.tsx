import React from "react";
import styled, { css } from "styled-components";

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
        const wouldSkipNextStep = index > activeItemIndex + 1;
        const isDisabled = !allowMovingForward && wouldSkipNextStep;
        return (
          <UIBulletClicker
            key={getObjectKey(item)}
            $isActive={isActive}
            $isDisabled={isDisabled}
            onClick={() => {
              if (wouldSkipNextStep) return;

              onActivateRequest(item);
            }}
          >
            <UIBulletHolder
            //
            //  data-tooltip={wouldSkipNextStep ? "Cannot skip previous step" : undefined}
            >
              <UIBullet />
            </UIBulletHolder>
          </UIBulletClicker>
        );
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  justify-content: center;
  height: 50px;
  align-items: stretch;
`;

const BULLET_SIZE = 8;

const UIBulletClicker = styled.div<{ $isActive: boolean; $isDisabled: boolean }>`
  display: flex;
  align-items: center;

  opacity: ${(props) => (props.$isActive ? 0.7 : 0.3)};
  /* pointer-events: ${(props) => (props.$isDisabled ? "none" : "all")}; */

  ${theme.transitions.hover()}

  ${(props) => {
    const { $isActive, $isDisabled } = props;

    if ($isDisabled) return;

    return css`
      &:hover {
        opacity: ${$isActive ? 0.7 : 0.5};

        ${UIBullet} {
          transform: scale(1.2);
        }
      }

      &:active {
        opacity: 0.7;
      }
    `;
  }}
`;

const UIBulletHolder = styled.div`
  padding: 12px;
`;

const UIBullet = styled.div`
  width: ${BULLET_SIZE}px;
  height: ${BULLET_SIZE}px;
  border-radius: ${BULLET_SIZE}px;
  background-color: ${theme.colors.text.value};
  transition: 0.2s all;
`;
