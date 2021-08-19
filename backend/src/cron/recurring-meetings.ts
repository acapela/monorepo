import { addDays, isBefore } from "date-fns";

import { Room, db } from "~db";

async function restartRoom(room: Room) {
  if (!room.recurring_days) return;

  const newDeadline = addDays(room.deadline, room.recurring_days);
  const timestamp = new Date();
  await db.topic.updateMany({
    where: {
      NOT: {
        closed_at: null,
      },
      archived_at: null,
    },
    data: {
      archived_at: timestamp,
    },
  });
  await db.room.update({
    where: {
      id: room.id,
    },
    data: {
      deadline: newDeadline,
      recurring_last_restart: timestamp,
    },
  });
}

export async function recurringMeetingCronHandler() {
  const rooms = await db.room.findMany({
    where: {
      NOT: {
        recurring_days: null,
      },
    },
  });
  if (rooms.length === 0) return;
  for (const room of rooms) {
    if (!isBefore(room.deadline, new Date())) continue;
    await restartRoom(room);
  }
}
