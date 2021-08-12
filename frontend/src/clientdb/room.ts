import gql from "graphql-tag";
import { defineEntity } from "~clientdb";
import { RoomFragment, UpdatedRoomsQuery, UpdatedRoomsQueryVariables } from "~frontend/../../gql";
import { createQuery } from "~frontend/gql/utils";
import { clientdb } from ".";
import { userEntity } from "./user";
import { getType } from "./utils";

const roomFragment = gql`
  fragment Room on room {
    id
    owner_id
    creator_id
    finished_at
    created_at
    is_private
    deadline
    last_activity_at
    slug
    source_google_calendar_event_id
    space_id
    summary
    membersIds: members {
      user_id
    }
  }
`;

const [, { subscribe: subscribeToRoomUpdates }] = createQuery<UpdatedRoomsQuery, UpdatedRoomsQueryVariables>(
  () => gql`
    ${roomFragment}

    query UpdatedRooms($lastSyncDate: timestamptz) {
      room(where: { created_at: { _gte: $lastSyncDate } }) {
        ...Room
      }
    }
  `
);

export const roomEntity = defineEntity(
  {
    type: getType<RoomFragment>(),
    name: "room",
    getCacheKey: (space) => space.id,
    sync: {
      runSync({ lastSyncDate, updateItems }) {
        return subscribeToRoomUpdates({ lastSyncDate: lastSyncDate?.toISOString() ?? null }, (newData) => {
          updateItems(newData.room);
        });
      },
    },
  },
  (room) => {
    const memberIds = room.membersIds.map((member) => member.user_id);
    return {
      get members() {
        return clientdb.user.query((user) => memberIds.includes(user.id));
      },
      get creator() {
        return clientdb.user.findById(room.creator_id);
      },
      get owner() {
        if (!room.owner_id) return null;
        return clientdb.user.findById(room.owner_id);
      },
      get space() {
        return clientdb.space.findById(room.space_id);
      },
      get topics() {
        return clientdb.topic.query((topic) => topic.room_id === room.id);
      },
    };
  }
);
