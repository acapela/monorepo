import React, { ReactNode } from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

import { MultipleOptionsDropdown } from "./multiple";
import { SelectedOptionPreview } from "./SelectedOptionPreview";

interface Props<I> {
  name?: string;
  items: I[];
  selectedItem?: I;
  keyGetter: (item: I) => string;
  labelGetter: (item: I) => string;
  iconGetter?: (item: I) => ReactNode;
  onChange: (item: I) => void;
  newItem?: {
    onCreateRequest: () => void;
    label: string;
  };
  placeholder?: string;
  icon?: ReactNode;
  isDisabled?: boolean;
  children?: ReactNode;
}

export function SingleOptionDropdown<I>({
  name,
  items,
  selectedItem,
  keyGetter,
  iconGetter,
  labelGetter,
  newItem,
  placeholder,
  onChange,
  icon,
  isDisabled,
  children,
}: Props<I>) {
  return (
    <MultipleOptionsDropdown<I>
      name={name}
      icon={icon}
      items={items}
      selectedItems={selectedItem ? [selectedItem] : []}
      keyGetter={keyGetter}
      labelGetter={labelGetter}
      newItem={newItem}
      placeholder={placeholder}
      onItemSelected={(item) => {
        onChange(item);
      }}
      iconGetter={iconGetter}
      closeAfterItemPicked
      isDisabled={isDisabled}
      selectedItemsPreviewRenderer={([item]) => {
        if (!item) {
          return <UIBody>{placeholder}</UIBody>;
        }

        return <SelectedOptionPreview label={labelGetter(item)} icon={iconGetter?.(item)} />;
      }}
    >
      {children}
    </MultipleOptionsDropdown>
  );
}

const UIBody = styled.div`
  ${theme.typo.body}
`;
