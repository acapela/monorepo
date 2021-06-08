import { format } from "date-fns";
import React, { useRef } from "react";
import styled from "styled-components";
import { hoverActionCss } from "~ui/transitions";
import { UIText } from "~ui/UIText";
import { RoomDetailedInfoFragment } from "~frontend/gql";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { Popover } from "~ui/popovers/Popover";
import { DateTimePicker } from "./DateTimePicker";
import { AnimatePresence } from "framer-motion";
import { useUpdateRoomDeadlineMutation } from "~frontend/gql/rooms";

interface Props {
  room: RoomDetailedInfoFragment;
}

export const Deadline = ({ room }: Props) => {
  const { deadline } = room;

  const [editRoom] = useUpdateRoomDeadlineMutation();

  const ref = useRef<HTMLButtonElement>(null);

  const [isPickerOpen, { toggle: toggleOpenPicker }] = useBoolean(false);

  const date = new Date(deadline);

  const handleSubmit = (deadline: Date) => {
    toggleOpenPicker();
    editRoom({ roomId: room.id, deadline });
  };

  return (
    <>
      {isPickerOpen && (
        <AnimatePresence>
          <Popover placement={"bottom-start"} anchorRef={ref}>
            <DateTimePicker onSubmit={handleSubmit} initialValue={date} />
          </Popover>
        </AnimatePresence>
      )}
      <UIHolder onClick={toggleOpenPicker} ref={ref}>
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
