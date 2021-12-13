import { AnimatePresence } from "framer-motion";
import React, { useRef } from "react";
import styled from "styled-components";

import { useBoolean } from "~shared/hooks/useBoolean";
import { FieldWithLabel } from "~ui/forms/FieldWithLabel";
import { IconCalendar } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";
import { theme } from "~ui/theme";

import { DateTimePicker } from "./DateTimePicker";

interface Props {
  value: Date;
  onChange: (value: Date) => void;
  isReadonly?: boolean;
  label?: string;
  shouldSkipConfirmation?: boolean;
}

export const DateTimeInput = ({ value, onChange, isReadonly = false, shouldSkipConfirmation, label }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isPickerOpen, { toggle: toggleOpenPicker, set: openPicker, unset: closePicker }] = useBoolean(false);

  const handleSubmit = async (date: Date) => {
    toggleOpenPicker();
    onChange(date);
  };

  const hasValue = !!value;

  return (
    <>
      <AnimatePresence>
        {isPickerOpen && (
          <Popover enableScreenCover onClickOutside={closePicker} placement={"bottom"} anchorRef={ref}>
            <DateTimePicker
              shouldSkipConfirmation={shouldSkipConfirmation}
              onSubmit={handleSubmit}
              initialValue={value}
            />
          </Popover>
        )}
      </AnimatePresence>
      <FieldWithLabel
        ref={ref}
        isDisabled={isReadonly}
        onClick={openPicker}
        label={label}
        pushLabel={hasValue}
        icon={<IconCalendar />}
        indicateDropdown
        cursorType="action"
      >
        <UIHolder isReadonly={isReadonly} onFocus={openPicker} onClick={openPicker}>
          <UIBody>{value.toLocaleString()}</UIBody>
        </UIHolder>
      </FieldWithLabel>
    </>
  );
};

const UIHolder = styled.div<{ isReadonly: boolean }>`
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const UIBody = styled.div`
  ${theme.typo.content};
`;
