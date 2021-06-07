import React, { useEffect, useMemo, useRef } from "react";
import { addMinutes, format, minutesInHour, startOfDay } from "date-fns";
import { Option } from "~ui/forms/Option";
import { UIText } from "~ui/UIText";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

const PICKER_MINUTES_STEP = 15;
const START_HOUR = 0;
const END_HOUR = 24;

export const getRange = (length: number) => [...Array(length).keys()];

const getMinutes = (): number[] => {
  const stepsNumber = ((END_HOUR - START_HOUR) * minutesInHour) / PICKER_MINUTES_STEP;
  return getRange(stepsNumber).map((i) => START_HOUR * minutesInHour + PICKER_MINUTES_STEP * i);
};

export const TimePicker = ({ value, onChange }: Props) => {
  const dayStart = useMemo(() => startOfDay(new Date()), []);
  const selectedElement = useRef<HTMLDivElement>(null);
  const options = useMemo(getMinutes, []);
  useEffect(() => {
    selectedElement.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [value]);
  return (
    <div>
      {options.map((minutes) => {
        const selected = minutes === value;
        return (
          <div key={minutes} ref={selected ? selectedElement : undefined}>
            <Option value={minutes} onSelect={() => onChange(minutes)} name="time" selected={selected}>
              <UIText size={15}>{format(addMinutes(dayStart, minutes), "p")}</UIText>
            </Option>
          </div>
        );
      })}
    </div>
  );
};
