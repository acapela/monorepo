import { ReactNode } from "react";
import styled from "styled-components";

import { useListWithNavigation } from "~shared/hooks/useListWithNavigation";
import { borderRadius, shadow } from "~ui/baseStyles";
import { useShortcut } from "~ui/keyboard/useShortcut";
import { hoverActionActiveCss, hoverActionCss } from "~ui/transitions";

interface Props<T> {
  items: T[];
  keyGetter: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  onItemSelected: (item: T) => void;
  className?: string;
}

export function SelectList<T>({ items, keyGetter, renderItem, onItemSelected }: Props<T>) {
  const { activeItem } = useListWithNavigation(items, { enableKeyboard: true });

  const activeKey = activeItem ? keyGetter(activeItem) : null;

  useShortcut("Enter", () => {
    if (!activeItem) return;

    onItemSelected(activeItem);

    // If item is selected, mark event as handled preventing other shortcut handlers from reaching it.
    return true;
  });

  return (
    <UIHolder>
      {items.map((item) => {
        const key = keyGetter(item);
        const isActive = activeKey === key;
        return (
          <UIItem isActive={isActive} onClick={() => onItemSelected(item)} key={key}>
            {renderItem(item)}
          </UIItem>
        );
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  min-width: 15rem;
  padding: 0.5rem 0;

  background: #ffffff;

  border: 1px solid #f8f8f8;
  box-sizing: border-box;
  ${shadow.modal};
  ${borderRadius.menu}
`;

const UIItem = styled.div<{ isActive: boolean }>`
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;

  ${hoverActionCss};

  ${(props) => props.isActive && hoverActionActiveCss}

  border-radius: 0;
`;
