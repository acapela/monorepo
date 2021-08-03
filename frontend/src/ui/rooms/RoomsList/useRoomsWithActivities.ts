import { useRoomsQuery } from "~frontend/gql/rooms";
import { useSSRRoomsMessagesCount } from "~frontend/utils/unreadMessages";
import { RoomDetailedInfoFragment, RoomsQueryVariables } from "~gql";

export interface RoomWithActivities {
  room: RoomDetailedInfoFragment;
  unreadMessages: number;
}

interface Props {
  query: RoomsQueryVariables;
}

export function useRoomsWithActivities(rooms: RoomDetailedInfoFragment[]): RoomWithActivities[] {
  const roomUnreadMessages = useSSRRoomsMessagesCount();

  return rooms.map((room: RoomDetailedInfoFragment) => ({
    room,
    unreadMessages: roomUnreadMessages[room.id] ?? 0,
  }));
}
