import { useSSRRoomsMessagesCount } from "~frontend/utils/unreadMessages";
import { RoomDetailedInfoFragment } from "~gql";

export interface RoomWithActivity {
  room: RoomDetailedInfoFragment;
  unreadMessages: number;
}

export function useRoomsWithActivities(rooms: RoomDetailedInfoFragment[]): RoomWithActivity[] {
  const roomUnreadMessages = useSSRRoomsMessagesCount();

  return rooms.map((room: RoomDetailedInfoFragment) => ({
    room,
    unreadMessages: roomUnreadMessages[room.id] ?? 0,
  }));
}
