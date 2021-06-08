import { format } from "date-fns";
import React, { useRef } from "react";
import styled from "styled-components";
import { hoverActionCss } from "~ui/transitions";
import { RoomDetailedInfoFragment } from "~frontend/gql";
import { useBoolean } from "~frontend/hooks/useBoolean";
import { Popover } from "~ui/popovers/Popover";
import { DateTimePicker } from "./DateTimePicker";
import { AnimatePresence } from "framer-motion";
import { useUpdateRoomDeadlineMutation } from "~frontend/gql/rooms";
import { SecondaryText } from "~ui/typo";
import { useClickAway } from "react-use";

interface Props {
  room: RoomDetailedInfoFragment;
}

export const DeadlineManager = ({ room }: Props) => {
  const { deadline } = room;

  const [updateRoomDeadline] = useUpdateRoomDeadlineMutation();

  const [isPickerOpen, { toggle: toggleOpenPicker }] = useBoolean(false);

  const ref = useRef<HTMLButtonElement>(null);
  const pickerHolderRef = useRef<HTMLDivElement>(null);
  useClickAway(pickerHolderRef, toggleOpenPicker);

  const date = new Date(deadline);

  const handleSubmit = (deadline: Date) => {
    toggleOpenPicker();
    updateRoomDeadline({ roomId: room.id, deadline });
  };

  return (
    <>
      <AnimatePresence>
        {isPickerOpen && (
          <Popover placement={"bottom-start"} anchorRef={ref}>
            <UIPickerHolder ref={pickerHolderRef}>
              <DateTimePicker onSubmit={handleSubmit} initialValue={date} />
            </UIPickerHolder>
          </Popover>
        )}
      </AnimatePresence>
      <UIHolder onClick={toggleOpenPicker} ref={ref}>
        <SecondaryText>{format(date, "dd.MM.yyyy, p")}</SecondaryText>
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

const UIPickerHolder = styled.div``;
