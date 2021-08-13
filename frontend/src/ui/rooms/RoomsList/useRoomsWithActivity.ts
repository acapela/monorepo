import { useRoomsQuery } from "~frontend/gql/rooms";
import { useSSRRoomsMessagesCount } from "~frontend/utils/unreadMessages";
import { RoomDetailedInfoFragment, RoomsQueryVariables } from "~gql";

export interface RoomWithActivity {
  room: RoomDetailedInfoFragment;
  unreadMessages: number;
}

interface Props {
  query: RoomsQueryVariables;
}

export function useRoomsWithActivity({ query }: Props): RoomWithActivity[] {
  const [rooms = []] = useRoomsQuery(query);

  const roomUnreadMessages = useSSRRoomsMessagesCount();

  return rooms.map((room: RoomDetailedInfoFragment) => ({
    room,
    unreadMessages: roomUnreadMessages[room.id] ?? 0,
  }));
}
