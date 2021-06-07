import React, { useCallback, useMemo, useState } from "react";
import { getMinutes, getHours, minutesInHour, addMinutes, startOfDay } from "date-fns";
import styled from "styled-components";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import { Button } from "~ui/button";
import { TimePicker } from "./TimePicker";

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
  const minutes = useMemo(() => {
    const hours = getHours(value);
    const minutes = getMinutes(value);
    return hours * minutesInHour + minutes;
  }, [value]);
  const handleTimeChange = useCallback((minutes: number) => {
    const date = addMinutes(startOfDay(value), minutes);
    setValue(date);
  }, []);
  return (
    <UIHolder
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <UIPickers>
        <DayPicker selectedDays={value} onDayClick={setValue} />
        <TimePicker onChange={handleTimeChange} value={minutes} />
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
  grid-gap: 12px;
  grid-template-columns: 1fr;
  padding: 12px;
`;

const UIPickers = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
`;
