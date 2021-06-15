import React, { useMemo, useState } from "react";
import { getMinutes, getHours, minutesInHour, addMinutes, startOfDay } from "date-fns";
import styled from "styled-components";
import { Calendar } from "~ui/time/Calendar";
import { TimePicker } from "./TimePicker";
import { Button } from "~ui/buttons/Button";
import { shadow } from "~ui/baseStyles";
import { BACKGROUND_ACCENT } from "~ui/colors";
import { PopPresenceAnimator } from "~ui/animations";

interface Props {
  initialValue: Date;
  onSubmit: (date: Date) => void;
}

export const DateTimePicker = ({ initialValue, onSubmit }: Props) => {
  const [dirtyDate, setDirtyDate] = useState<Date>(initialValue);
  const didUserChangeInitialValue = dirtyDate === initialValue;

  const handleSubmit = () => {
    if (!didUserChangeInitialValue) {
      onSubmit(dirtyDate);
    }
  };

  const pickedMinutesValue = useMemo(() => {
    const hours = getHours(dirtyDate);
    const minutes = getMinutes(dirtyDate);
    return hours * minutesInHour + minutes;
  }, [dirtyDate]);

  const handleTimeChange = (minutes: number) => {
    const newDate = addMinutes(startOfDay(dirtyDate), minutes);
    setDirtyDate(newDate);
  };

  const handleDayChange = (date: Date) => {
    const newDate = addMinutes(startOfDay(date), pickedMinutesValue);
    setDirtyDate(newDate);
  };

  return (
    <UIDateTimePickerForm>
      <UIPickers>
        <Calendar date={dirtyDate} onDateChange={handleDayChange} />
        <UITimePickerWrapper>
          <TimePicker onChange={handleTimeChange} value={pickedMinutesValue} />
        </UITimePickerWrapper>
      </UIPickers>
<<<<<<< HEAD:ui/time/DateTimePicker/index.tsx
      <Button isDisabled={didUserChangeInitialValue} onClick={handleSubmit}>
=======
      <Button onClick={() => null} isDisabled={didUserChangeInitialValue}>
>>>>>>> reusable DateTime input:frontend/src/ui/DateTimeInput/DateTimePicker/index.tsx
        Save
      </Button>
    </UIDateTimePickerForm>
  );
};

const UIDateTimePickerForm = styled(PopPresenceAnimator)`
  background: #ffffff;
  ${shadow.medium};
  border-radius: 12px;
  display: grid;
  grid-gap: 24px;
  grid-template-columns: 1fr;
  padding: 12px;
`;

const UIPickers = styled.div`
  display: grid;
  grid-template-columns: minmax(320px, 1fr) auto;
  gap: 10px;
`;

const UITimePickerWrapper = styled.div`
  padding: 16px;
  border-left: 1px solid ${BACKGROUND_ACCENT};
  overflow: auto;
  max-height: 300px;
`;
