import { compareAsc, compareDesc } from "date-fns";
import { useSSRRoomsMessagesCount } from "~frontend/utils/unreadMessages";
import { RoomDetailedInfoFragment } from "~gql";

export interface RoomWithActivities {
  room: RoomDetailedInfoFragment;
  unreadMessages: number;
}

type Sort = "asc" | "desc";

interface Props {
  rooms: RoomDetailedInfoFragment[];
  options?: {
    sort?: Sort;
  };
}

const EARLIEST_POSSIBLE_DATE = new Date(0);

function sortRoomsBy(roomsWithActivities: RoomWithActivities[], sort: Sort): void {
  const compareFn = sort === "asc" ? compareAsc : compareDesc;
  const lastActivityFallback = sort === "asc" ? new Date() : EARLIEST_POSSIBLE_DATE;

  roomsWithActivities.sort(({ room: roomA }, { room: roomB }) => {
    const dateA = roomA.last_activity_at ? new Date(roomA.last_activity_at) : lastActivityFallback;
    const dateB = roomB.last_activity_at ? new Date(roomB.last_activity_at) : lastActivityFallback;
    return compareFn(dateA, dateB);
  });
}

export function useRoomsWithActivities({ rooms, options }: Props): RoomWithActivities[] {
  const roomUnreadMessages = useSSRRoomsMessagesCount();

  const roomsWithActivities = rooms.map((room: RoomDetailedInfoFragment) => ({
    room,
    unreadMessages: roomUnreadMessages[room.id] ?? 0,
  }));

  if (options?.sort) {
    sortRoomsBy(roomsWithActivities, options.sort);
  }

  return roomsWithActivities;
}
