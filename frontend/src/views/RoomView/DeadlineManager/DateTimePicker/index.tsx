import React, { useMemo, useState } from "react";
import { getMinutes, getHours, minutesInHour, addMinutes, startOfDay } from "date-fns";
import styled from "styled-components";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { TimePicker } from "./TimePicker";
import { Button } from "~ui/buttons/Button";
import { shadow } from "~ui/baseStyles";

interface Props {
  initialValue: Date;
  onSubmit: (date: Date) => void;
}

export const DateTimePicker = ({ initialValue, onSubmit }: Props) => {
  const [value, setValue] = useState<Date>(initialValue);
  const didUserChangeInitialValue = value === initialValue;

  const handleSubmit = () => {
    if (!didUserChangeInitialValue) {
      onSubmit(value);
    }
  };

  const pickedMinutesValue = useMemo(() => {
    const hours = getHours(value);
    const minutes = getMinutes(value);
    return hours * minutesInHour + minutes;
  }, [value]);

  const handleTimeChange = (minutes: number) => {
    const newDate = addMinutes(startOfDay(value), minutes);
    setValue(newDate);
  };

  const handleDayChange = (date: Date) => {
    const newDate = addMinutes(startOfDay(date), pickedMinutesValue);
    setValue(newDate);
  };

  return (
    <UIDateTimePickerForm
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
      <Button isDisabled={didUserChangeInitialValue}>Save</Button>
    </UIDateTimePickerForm>
  );
};

const UIDateTimePickerForm = styled.form`
  background: #ffffff;
  box-shadow: ${shadow.medium};
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
