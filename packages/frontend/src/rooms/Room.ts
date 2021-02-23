import { gql, useMutation, useQuery } from "@apollo/client";

export interface Room {
  id: string;
  name: string;

  participants?: {
    user: User;
  }[];

  threads?: Thread[];
}

export interface Thread {
  id: string;
  name: string;
  index: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export type RoomLoaded = { loading: false; room: Room; error: null };
export type RoomLoading = { loading: true; room: null; error: null };
export type RoomFailure = { loading: false; room: null; error: Error };
export type RoomUseResult = RoomLoaded | RoomLoading | RoomFailure;

export const useRoom = (id: string): RoomUseResult => {
  const { loading, data: { room } = {}, error } = useQuery(RoomQuery.READ_ROOM_BY_ID, {
    variables: { id },
  });
  if (error) {
    return { loading: false, room: null, error };
  }
  if (!loading) {
    return { loading: false, room, error: null };
  }
  return { loading: true, room: null, error: null };
};

export type RoomsLoaded = { loading: false; rooms: Room[]; error: null };
export type RoomsLoading = { loading: true; rooms: Room[]; error: null };
export type RoomsFailure = { loading: false; rooms: Room[]; error: Error };
export type RoomsUseResult = RoomsLoaded | RoomsLoading | RoomsFailure;

export const useRooms = (): RoomsUseResult => {
  const { loading, data: { room: rooms } = {}, error } = useQuery(RoomQuery.READ_ROOMS);

  if (error) {
    return { loading: false, rooms: [], error };
  }
  if (!loading) {
    return { loading: false, rooms, error: null };
  }
  return { loading: true, rooms: [], error: null };
};

export interface ThreadCreation {
  createThread(thread: { name: string; index: string }): Promise<Thread>;
  loading: boolean;
  error?: Error;
}

export const useThreadCreation = (roomId: string): ThreadCreation => {
  const [createThread, { loading, error }] = useMutation(RoomQuery.CREATE_THREAD, {
    refetchQueries: [{ query: RoomQuery.READ_ROOM_BY_ID, variables: { id: roomId } }],
  });
  return {
    createThread: async (args) => {
      const result = await createThread({ variables: { ...args, roomId } });
      return result.data.thread;
    },
    loading,
    error,
  };
};

export interface RoomCreation {
  createRoom(room: { name: string }): Promise<Room>;
  loading: boolean;
  error?: Error;
}

export const useRoomCreation = (): RoomCreation => {
  const [createRoom, { loading, error }] = useMutation(RoomQuery.CREATE_ROOM, {
    refetchQueries: [{ query: RoomQuery.READ_ROOMS }],
  });
  return {
    createRoom: async (variables) => {
      const result = await createRoom({ variables });
      return result.data.room;
    },
    loading,
    error,
  };
};

export const RoomQuery = {
  READ_ROOMS: gql`
    query GetRooms {
      room {
        id
        name
        participants {
          user {
            id
            name
            avatarUrl: avatar_url
          }
        }
      }
    }
  `,

  READ_ROOM_BY_ID: gql`
    query GetRoom($id: uuid!) {
      room: room_by_pk(id: $id) {
        id
        name

        participants {
          user {
            id
            name
            avatarUrl: avatar_url
          }
        }

        threads {
          id
          name
          index
        }
      }
    }
  `,

  CREATE_ROOM: gql`
    mutation CreateRoom($name: String!) {
      room: insert_room_one(object: { name: $name }) {
        id
      }
    }
  `,

  CREATE_THREAD: gql`
    mutation CreateThread($name: String!, $roomId: uuid!, $index: String!) {
      thread: insert_thread_one(object: { name: $name, room_id: $roomId, index: $index }) {
        id
      }
    }
  `,
};
