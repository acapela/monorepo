import React, { useRef } from "react";
import { format } from "date-fns";
import { AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { hoverActionCss } from "~ui/transitions";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Popover } from "~ui/popovers/Popover";
import { DateTimePicker } from "./DateTimePicker";
import { SecondaryText } from "~ui/typo";
import { BACKGROUND_ACCENT } from "~ui/colors";
import { disabledPointerEventsCss } from "~ui/disabled";

interface Props {
  value: Date;
  onChange: (value: Date) => void;
  isReadonly?: boolean;
}

export const DateTimeInput = ({ value, onChange, isReadonly = false }: Props) => {
  const ref = useRef<HTMLButtonElement>(null);

  const [isPickerOpen, { toggle: toggleOpenPicker }] = useBoolean(false);

  const handleSubmit = async (date: Date) => {
    toggleOpenPicker();
    onChange(date);
  };

  return (
    <>
      <AnimatePresence>
        {isPickerOpen && (
          <Popover onClickOutside={toggleOpenPicker} placement={"bottom-start"} anchorRef={ref}>
            <DateTimePicker onSubmit={handleSubmit} initialValue={value} />
          </Popover>
        )}
      </AnimatePresence>
      <UIHolder isReadonly={isReadonly} onClick={toggleOpenPicker} ref={ref}>
        <SecondaryText>{format(value, "dd.MM.yyyy, p")}</SecondaryText>
      </UIHolder>
    </>
  );
};

const UIHolder = styled.button<{ isReadonly: boolean }>`
  ${(props) => !props.isReadonly && hoverActionCss}
  ${(props) => props.isReadonly && disabledPointerEventsCss}
  padding: 8px 16px;
  cursor: pointer;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid ${BACKGROUND_ACCENT};
  text-align: start;
`;
