import React, { ReactNode } from "react";

import { TextBody } from "~ui/typo";

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
    onCreateRequest: () => void;
    label: string;
  };
  placeholder?: string;
  icon?: ReactNode;
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
      selectedItemsPreviewRenderer={([item]) => {
        if (!item) {
          return <TextBody>{placeholder}</TextBody>;
        }

        return <OptionLabel label={labelGetter(item)} icon={iconGetter?.(item)} />;
      }}
    />
  );
}
