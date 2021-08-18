import gql from "graphql-tag";
import { defineEntity } from "~clientdb";
import { RoomFragment, UpdatedRoomsQuery, UpdatedRoomsQueryVariables } from "~frontend/../../gql";
import { renderedApolloClientPromise } from "~frontend/apollo/client";
import { createQuery } from "~frontend/gql/utils";
import { clientdb } from ".";
import { spaceEntity } from "./space";
import { topicEntity } from "./topic";
import { userEntity } from "./user";
import { getType } from "./utils";

const roomFragment = gql`
  fragment Room on room {
    id
    owner_id
    creator_id
    finished_at
    updated_at
    is_private
    name
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
      room(where: { updated_at: { _gte: $lastSyncDate } }) {
        ...Room
      }
    }
  `
);

export const roomEntity = defineEntity(
  {
    type: getType<RoomFragment>(),
    name: "room",
    getId: (item) => item.id,
    getCacheKey: (space) => space.id,
    sync: {
      initPromise: () => renderedApolloClientPromise,
      pull({ lastSyncDate, updateItems }) {
        return subscribeToRoomUpdates({ lastSyncDate: lastSyncDate?.toISOString() ?? null }, (newData) => {
          updateItems(newData.room);
        });
      },
    },
  },
  (room, { getEntity }) => {
    const memberIds = room.membersIds.map((member) => member.user_id);
    return {
      get members() {
        return getEntity(userEntity).query((user) => memberIds.includes(user.id));
      },
      get creator() {
        return getEntity(userEntity).findById(room.creator_id);
      },
      get owner() {
        if (!room.owner_id) return null;
        return getEntity(userEntity).findById(room.owner_id);
      },
      get space() {
        return getEntity(spaceEntity).findById(room.space_id);
      },
      get topics() {
        return getEntity(topicEntity).query((topic) => topic.room_id === room.id);
      },
    };
  }
);
