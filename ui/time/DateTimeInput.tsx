import React, { useRef } from "react";
import { format } from "date-fns";
import { AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { hoverActionCss } from "~ui/transitions";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Popover } from "~ui/popovers/Popover";
import { SecondaryText, ValueText } from "~ui/typo";
import { BACKGROUND_ACCENT } from "~ui/colors";
import { disabledPointerEventsCss } from "~ui/disabled";
import { DateTimePicker } from "./DateTimePicker";
import { borderRadius } from "~ui/baseStyles";
import { FieldWithLabel } from "~ui/forms/FieldWithLabel";
import { IconCalendar } from "~ui/icons";

interface Props {
  value: Date;
  onChange: (value: Date) => void;
  isReadonly?: boolean;
  label?: string;
}

export const DateTimeInput = ({ value, onChange, isReadonly = false, label }: Props) => {
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
          <Popover onClickOutside={closePicker} placement={"bottom-start"} anchorRef={ref}>
            <DateTimePicker onSubmit={handleSubmit} initialValue={value} />
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
      >
        <UIHolder isReadonly={isReadonly} onFocus={openPicker} type="button" onClick={openPicker}>
          <ValueText>{format(value, "dd.MM.yyyy, p")}</ValueText>
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
