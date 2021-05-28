import { ReactNode } from "react";
import styled from "styled-components";
import { hoverActionCss } from "~ui/transitions";

interface Props<T> {
  items: T[];
  keyGetter: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  onItemSelected: (item: T) => void;
  className?: string;
}

export function SelectList<T>({ items, keyGetter, renderItem, onItemSelected }: Props<T>) {
  // TODO: Add keyboard support. https://linear.app/acapela/issue/ACA-399/add-keyboard-support-to-select-lists
  return (
    <UIHolder>
      {items.map((item) => {
        const key = keyGetter(item);
        return (
          <UIItem onClick={() => onItemSelected(item)} key={key}>
            {renderItem(item)}
          </UIItem>
        );
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 15rem;
  padding: 0.5rem 0;

  background: #ffffff;

  border: 1px solid #f8f8f8;
  box-sizing: border-box;
  box-shadow: 0px 100px 80px rgba(0, 0, 0, 0.07), 0px 64.8148px 46.8519px rgba(0, 0, 0, 0.0531481),
    0px 38.5185px 25.4815px rgba(0, 0, 0, 0.0425185), 0px 20px 13px rgba(0, 0, 0, 0.035),
    0px 8.14815px 6.51852px rgba(0, 0, 0, 0.0274815), 0px 1.85185px 3.14815px rgba(0, 0, 0, 0.0168519);
  border-radius: 1rem;
`;
const UIItem = styled.div`
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;

  ${hoverActionCss};

  border-radius: 0;
`;
