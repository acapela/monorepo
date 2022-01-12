import { addMinutes, format, minutesInHour, startOfDay } from "date-fns";
import React, { useEffect, useMemo, useRef } from "react";
import { useRendersCount } from "react-use";
import styled from "styled-components";

import { RadioOption } from "@aca/ui/forms/RadioOption";
import { theme } from "@aca/ui/theme";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

const PICKER_MINUTES_STEP = 15;
const START_HOUR = 0;
const END_HOUR = 24;

export const getRange = (length: number) => [...Array(length).keys()];

const getMinutesRangeFromStartOfTheDay = (): number[] => {
  const stepsNumber = ((END_HOUR - START_HOUR) * minutesInHour) / PICKER_MINUTES_STEP;
  return getRange(stepsNumber).map((i) => START_HOUR * minutesInHour + PICKER_MINUTES_STEP * i);
};

export const TimePicker = ({ value, onChange }: Props) => {
  const dayStart = useMemo(() => startOfDay(new Date()), []);
  const isFirstRender = useRendersCount() === 1;

  const selectedElement = useRef<HTMLDivElement>(null);

  const options = useMemo(getMinutesRangeFromStartOfTheDay, []);

  useEffect(() => {
    selectedElement.current?.scrollIntoView({
      // We don't want to animate time scroll on initial render
      behavior: isFirstRender ? "auto" : "smooth",
      block: "center",
    });
  }, [value]);

  return (
    <UIHolder>
      {options.map((minutes) => {
        const isSelected = minutes === value;
        return (
          <div key={minutes} ref={isSelected ? selectedElement : undefined}>
            <RadioOption value={minutes} onSelect={() => onChange(minutes)} name="time" selected={isSelected}>
              <UIBody>{format(addMinutes(dayStart, minutes), "p")}</UIBody>
            </RadioOption>
          </div>
        );
      })}
    </UIHolder>
  );
};

const UIBody = styled.div`
  ${theme.typo.content.bold};
`;

const UIHolder = styled.div<{}>``;
