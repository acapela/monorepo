import React from "react";
import styled from "styled-components";

interface Props {
  date: Date;
}

export const DateTimePicker = ({ date }: Props) => {
  return (
    <UIHolder>
      <p>{date.toString()}</p>
    </UIHolder>
  );
};

const UIHolder = styled.div`
  background: #ffffff;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
`;
