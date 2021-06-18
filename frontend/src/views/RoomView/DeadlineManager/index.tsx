import { format } from "date-fns";
import React, { useRef } from "react";
import styled from "styled-components";
import { hoverActionCss } from "~ui/transitions";
import { RoomDetailedInfoFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Popover } from "~ui/popovers/Popover";
import { DateTimePicker } from "~ui/time/DateTimePicker";
import { AnimatePresence } from "framer-motion";
import { updateRoom } from "~frontend/gql/rooms";
import { SecondaryText } from "~ui/typo";
import { BACKGROUND_ACCENT } from "~ui/colors";
import { disabledPointerEventsCss } from "~ui/disabled";
import { borderRadius } from "~ui/baseStyles";

interface Props {
  room: RoomDetailedInfoFragment;
  isReadonly?: boolean;
}

export const DeadlineManager = ({ room, isReadonly = false }: Props) => {
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
      <UIHolder isReadonly={isReadonly} onClick={toggleOpenPicker} ref={ref}>
        <SecondaryText>{format(date, "dd.MM.yyyy, p")}</SecondaryText>
      </UIHolder>
    </>
  );
};

const UIHolder = styled.button<{ isReadonly: boolean }>`
  ${(props) => !props.isReadonly && hoverActionCss}
  ${(props) => props.isReadonly && disabledPointerEventsCss}
  padding: 8px 16px;
  cursor: pointer;
  background: #ffffff;
  ${borderRadius.input}
  border: 1px solid ${BACKGROUND_ACCENT};
  text-align: start;
`;
