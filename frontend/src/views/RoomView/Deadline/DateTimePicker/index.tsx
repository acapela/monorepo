import React, { useState } from "react";
import styled from "styled-components";
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";

interface Props {
  initialValue: Date;
}

export const DateTimePicker = ({ initialValue }: Props) => {
  const [value, setValue] = useState<Date>(initialValue);
  return (
    <UIHolder>
      <DayPicker selectedDays={value} onDayClick={setValue} />
    </UIHolder>
  );
};

const UIHolder = styled.div`
  background: #ffffff;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
`;
