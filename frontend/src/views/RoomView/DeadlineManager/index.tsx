import React from "react";

import { trackEvent } from "~frontend/analytics/tracking";
import { updateRoom } from "~frontend/gql/rooms";
import { RoomDetailedInfoFragment } from "~gql";
import { DateTimeInput } from "~ui/time/DateTimeInput";

interface Props {
  room: RoomDetailedInfoFragment;
  isReadonly?: boolean;
}

export const DeadlineManager = ({ room, isReadonly }: Props) => {
  const { deadline } = room;

  const date = new Date(deadline);

  const handleSubmit = async (deadline: Date) => {
    const oldDeadline = new Date(room.deadline);
    await updateRoom({ roomId: room.id, input: { deadline: deadline.toISOString() } });
    trackEvent("Updated Room Deadline", { roomId: room.id, newDeadline: date, oldDeadline });
  };

  return <DateTimeInput isReadonly={isReadonly} value={date} onChange={handleSubmit} />;
};
