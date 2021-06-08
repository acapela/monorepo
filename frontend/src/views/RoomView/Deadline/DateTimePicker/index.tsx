import React, { useMemo, useState } from "react";
import { getMinutes, getHours, minutesInHour, addMinutes, startOfDay } from "date-fns";
import styled from "styled-components";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { TimePicker } from "./TimePicker";
import { Button } from "~ui/buttons/Button";

interface Props {
  initialValue: Date;
  onSubmit: (date: Date) => void;
}

export const DateTimePicker = ({ initialValue, onSubmit }: Props) => {
  const [value, setValue] = useState<Date>(initialValue);
  const isSubmitDisabled = value === initialValue;

  const handleSubmit = () => {
    if (!isSubmitDisabled) {
      onSubmit(value);
    }
  };

  const pickedMinutesValue = useMemo(() => {
    const hours = getHours(value);
    const minutes = getMinutes(value);
    return hours * minutesInHour + minutes;
  }, [value]);

  const handleTimeChange = (minutes: number) => {
    const date = addMinutes(startOfDay(value), minutes);
    setValue(date);
  };

  const handleDayChange = (date: Date) => {
    const value = addMinutes(startOfDay(date), pickedMinutesValue);
    setValue(value);
  };

  return (
    <UIHolder
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <UIPickers>
        <DayPicker selectedDays={value} onDayClick={handleDayChange} />
        <UITimePickerWr>
          <TimePicker onChange={handleTimeChange} value={pickedMinutesValue} />
        </UITimePickerWr>
      </UIPickers>
      <Button isDisabled={isSubmitDisabled}>Save</Button>
    </UIHolder>
  );
};

const UIHolder = styled.form`
  background: #ffffff;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  display: grid;
  grid-gap: 24px;
  grid-template-columns: 1fr;
  padding: 12px;
`;

const UIPickers = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
`;

const UITimePickerWr = styled.div`
  padding: 16px;
  border-left: 1px solid #eae9ea;
  overflow: auto;
  max-height: 300px;
`;
