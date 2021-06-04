import { format } from "date-fns";
import React, { useRef } from "react";
import styled from "styled-components";
import { hoverActionCss } from "~ui/transitions";
import { UIText } from "~ui/UIText";
import { RoomDetailedInfoFragment } from "~frontend/gql";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { Popover } from "~ui/popovers/Popover";
import { DateTimePicker } from "./DateTimePicker";
import { useClickAway } from "react-use";

interface Props {
  room: RoomDetailedInfoFragment;
}

export const Deadline = ({ room }: Props) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { deadline } = room;
  const [isPickerOpen, { toggle }] = useBoolean(false);
  const date = new Date(deadline);
  useClickAway(ref, toggle);
  return (
    <>
      {isPickerOpen && (
        <Popover placement={"bottom-start"} anchorRef={ref}>
          <DateTimePicker date={date} />
        </Popover>
      )}
      <UIHolder onClick={toggle} ref={ref}>
        <UIText size={15}>{format(date, "dd.MM.yyyy, p")}</UIText>
      </UIHolder>
    </>
  );
};

const UIHolder = styled.button`
  ${hoverActionCss}
  padding: 8px 16px;
  cursor: pointer;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #eae9ea;
  text-align: start;
`;
