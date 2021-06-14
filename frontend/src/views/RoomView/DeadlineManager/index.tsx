import { format } from "date-fns";
import React, { useRef } from "react";
import styled from "styled-components";
import { hoverActionCss } from "~ui/transitions";
import { RoomDetailedInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Popover } from "~ui/popovers/Popover";
import { DateTimePicker } from "./DateTimePicker";
import { AnimatePresence } from "framer-motion";
import { updateRoom } from "~frontend/gql/rooms";
import { SecondaryText } from "~ui/typo";
import { LIGHT_GRAY } from "~ui/colors";

interface Props {
  room: RoomDetailedInfoFragment;
}

export const DeadlineManager = ({ room }: Props) => {
  const { deadline } = room;

  const ref = useRef<HTMLButtonElement>(null);

  const [isPickerOpen, { toggle: toggleOpenPicker }] = useBoolean(false);

  const date = new Date(deadline);

  const handleSubmit = async (deadline: Date) => {
    toggleOpenPicker();
    await updateRoom({ roomId: room.id, input: { deadline } });
  };

  return (
    <>
      <AnimatePresence>
        {isPickerOpen && (
          <Popover onClickOutside={toggleOpenPicker} placement={"bottom-start"} anchorRef={ref}>
            <DateTimePicker onSubmit={handleSubmit} initialValue={date} />
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
  border: 1px solid ${LIGHT_GRAY};
  text-align: start;
`;
