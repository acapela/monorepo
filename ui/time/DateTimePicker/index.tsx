import { addMinutes, getHours, getMinutes, minutesInHour, startOfDay } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { PopPresenceAnimator } from "~ui/animations";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";
import { Calendar } from "~ui/time/Calendar";

import { TimePicker } from "./TimePicker";

interface Props {
  initialValue: Date;
  onSubmit: (date: Date) => void;
  shouldSkipConfirmation?: boolean;
}

export const DateTimePicker = ({ initialValue, onSubmit, shouldSkipConfirmation = false }: Props) => {
  const [dirtyDate, setDirtyDate] = useState<Date>(initialValue);

  const handleSubmit = () => {
    onSubmit(dirtyDate);
  };

  useEffect(() => {
    if (shouldSkipConfirmation) {
      handleSubmit();
    }
  }, [shouldSkipConfirmation, dirtyDate]);

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
        <UICalendarHolder>
          <Calendar date={dirtyDate} onDateChange={handleDayChange} />
        </UICalendarHolder>

        <UITimePickerWrapper>
          <TimePicker onChange={handleTimeChange} value={pickedMinutesValue} />
        </UITimePickerWrapper>
      </UIPickers>
      {!shouldSkipConfirmation && (
        <Button kind="primary" type="button" onClick={handleSubmit} shortcut="Enter">
          Confirm
        </Button>
      )}
    </UIDateTimePickerForm>
  );
};

const UIDateTimePickerForm = styled(PopPresenceAnimator)<{}>`
  ${theme.colors.layout.background.asBgWithReadableText};
  ${theme.shadow.popover};
  ${theme.radius.panel};
  display: grid;
  grid-gap: 24px;
  grid-template-columns: 1fr;
  padding: 12px;
`;

const UIPickers = styled.div<{}>`
  display: grid;
  grid-template-columns: minmax(320px, 1fr) auto;
  gap: 10px;
`;

const UITimePickerWrapper = styled.div<{}>`
  padding: 16px;
  border-left: 1px solid ${theme.colors.layout.background.border};
  overflow: auto;
  max-height: 300px;
`;

const UICalendarHolder = styled.div<{}>`
  padding: 16px;
`;
