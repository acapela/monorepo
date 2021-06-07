import React, { useCallback, useState } from "react";
import styled from "styled-components";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { Button } from "~frontend/../../ui/button";

interface Props {
  initialValue: Date;
  onSubmit: (d: Date) => void;
}

export const DateTimePicker = ({ initialValue, onSubmit }: Props) => {
  const [value, setValue] = useState<Date>(initialValue);
  const isSubmitDisabled = value === initialValue;
  const handleSubmit = useCallback(() => {
    if (!isSubmitDisabled) {
      onSubmit(value);
    }
  }, [isSubmitDisabled, onSubmit, value]);
  return (
    <UIHolder
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <DayPicker selectedDays={value} onDayClick={setValue} />
      <Button isDisabled={isSubmitDisabled}>Save</Button>
    </UIHolder>
  );
};

const UIHolder = styled.form`
  background: #ffffff;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  display: grid;
  grid-gap: 12px;
  grid-template-columns: 1fr;
  padding: 12px;
`;
