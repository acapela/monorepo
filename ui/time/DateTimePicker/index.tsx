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
        <UITimePickerHeightLimiter>
          <UITimePickerWrapper>
            <TimePicker onChange={handleTimeChange} value={pickedMinutesValue} />
          </UITimePickerWrapper>
        </UITimePickerHeightLimiter>
      </UIPickers>
      {!shouldSkipConfirmation && (
        <UIFooter>
          <Button isWide kind="primary" type="button" onClick={handleSubmit} shortcut="Enter">
            Confirm
          </Button>
        </UIFooter>
      )}
    </UIDateTimePickerForm>
  );
};

const UIDateTimePickerForm = styled(PopPresenceAnimator)<{}>`
  ${theme.colors.layout.background.asBgWithReadableText};
  ${theme.shadow.popover};
  ${theme.radius.panel};
  display: flex;
  flex-direction: column;
  ${theme.spacing.actionsSection.asGap}

  padding: 24px;
`;

const UIPickers = styled.div<{}>`
  display: flex;
  ${theme.spacing.sections.asGap}
`;

const UITimePickerHeightLimiter = styled.div`
  min-height: 0;
  flex-basis: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const UITimePickerWrapper = styled.div<{}>`
  border-left: 1px solid ${theme.colors.layout.background.border};
  overflow: auto;
  min-height: 0;
  flex-basis: 0;
  flex-grow: 1;
  padding-left: 10px;
  padding-right: 5px;
`;

const UICalendarHolder = styled.div<{}>`
  padding-bottom: 0;
  width: 220px;
`;

const UIFooter = styled.div``;
