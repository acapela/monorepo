import React from "react";
import { RoomDetailedInfoFragment } from "~gql";
import { updateRoom } from "~frontend/gql/rooms";
import { DateTimeInput } from "~frontend/ui/DateTimeInput";

interface Props {
  room: RoomDetailedInfoFragment;
  isReadonly?: boolean;
}

export const DeadlineManager = ({ room, isReadonly }: Props) => {
  const { deadline } = room;

  const date = new Date(deadline);

  const handleSubmit = async (deadline: Date) => {
    await updateRoom({ roomId: room.id, input: { deadline } });
  };

  return <DateTimeInput value={date} onChange={handleSubmit} />;
};
