import { addDays } from "date-fns";

import { Room, db } from "~db";

async function restartRoom(room: Room) {
  if (!room.recurring_days) return;

  const newDeadline = addDays(room.deadline, room.recurring_days);
  const timestamp = new Date();
  await db.$transaction([
    db.topic.updateMany({
      where: {
        room_id: room.id,
        NOT: {
          closed_at: null,
        },
        archived_at: null,
      },
      data: {
        archived_at: timestamp,
      },
    }),
    db.room.update({
      where: {
        id: room.id,
      },
      data: {
        deadline: newDeadline,
        recurring_last_restart: timestamp,
      },
    }),
  ]);
}

export async function recurringMeetingCronHandler() {
  const rooms = await db.room.findMany({
    where: {
      deadline: {
        lt: new Date(),
      },
      NOT: {
        recurring_days: null,
      },
    },
  });
  for (const room of rooms) {
    await restartRoom(room);
  }
}
