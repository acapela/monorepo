import { compareAsc, compareDesc } from "date-fns";
import { useSSRRoomsMessagesCount } from "~frontend/utils/unreadMessages";
import { RoomDetailedInfoFragment } from "~gql";

export interface RoomWithActivities {
  room: RoomDetailedInfoFragment;
  unreadMessages: number;
}

interface Props {
  rooms: RoomDetailedInfoFragment[];
  options?: {
    sort?: "asc" | "desc";
  };
}

const EARLIEST_POSSIBLE_DATE = new Date(0);

export function useRoomsWithActivities({ rooms, options }: Props): RoomWithActivities[] {
  const roomUnreadMessages = useSSRRoomsMessagesCount();

  const roomsWithActivities = rooms.map((room: RoomDetailedInfoFragment) => ({
    room,
    unreadMessages: roomUnreadMessages[room.id] ?? 0,
  }));

  if (options?.sort) {
    const compareFn = options.sort === "asc" ? compareAsc : compareDesc;
    roomsWithActivities.sort(({ room: roomA }, { room: roomB }) => {
      const dateA = roomA.last_activity_at ? new Date(roomA.last_activity_at) : EARLIEST_POSSIBLE_DATE;
      const dateB = roomB.last_activity_at ? new Date(roomB.last_activity_at) : EARLIEST_POSSIBLE_DATE;
      return compareFn(dateA, dateB);
    });
  }

  return roomsWithActivities;
}
