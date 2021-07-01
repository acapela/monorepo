import React, { ReactNode } from "react";
import { SecondaryText } from "~ui/typo";
import { MultipleOptionsDropdown } from "./multiple";
import { OptionLabel } from "./OptionLabel";

interface Props<I> {
  name?: string;
  items: I[];
  selectedItem?: I;
  keyGetter: (item: I) => string;
  labelGetter: (item: I) => string;
  iconGetter?: (item: I) => ReactNode;
  onChange: (item: I) => void;
  newItem?: {
    onCreateRequest: (itemName: string) => void;
    label: string;
  };
  placeholder?: string;
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
}: Props<I>) {
  return (
    <MultipleOptionsDropdown<I>
      name={name}
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
      selectedItemsPreviewRenderer={([item]) => {
        if (!item) {
          return <SecondaryText>{placeholder}</SecondaryText>;
        }

        return <OptionLabel label={labelGetter(item)} icon={iconGetter?.(item)} />;
      }}
    />
  );
}
