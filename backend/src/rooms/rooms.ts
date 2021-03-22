import Knex from "knex";
import { v4 as uuid } from "uuid";
import database from "../database";

export async function findRoomById(roomId: string): Promise<Room | null> {
  const [databaseRoom] = await database
    .select(["id", "creator_id", "name", "created_at", "deadline", "notification_job_id", "summary", "finished_at"])
    .from("room")
    .where({ id: roomId })
    .limit(1);

  if (databaseRoom) {
    return convertDatabaseRoom(databaseRoom);
  }

  return null;
}

export async function createRoom({ creatorId, name }: { creatorId: string; name: string }): Promise<Room> {
  const [databaseRoom] = await database("room")
    .insert({
      id: uuid(),
      creator_id: creatorId,
      name,
    })
    .returning(["id", "creator_id", "name", "created_at", "deadline", "notification_job_id", "summary", "finished_at"]);
  return convertDatabaseRoom(databaseRoom);
}

export async function addParticipant(
  roomId: string,
  participantId: string,
  transaction: Knex = database
): Promise<void> {
  await transaction("room_participants").insert({ room_id: roomId, user_id: participantId });
}

export async function getIfParticipantExists(roomId: string, participantId: string): Promise<boolean> {
  const [entry] = await database
    .select("*")
    .from("room_participants")
    .where({ room_id: roomId, user_id: participantId })
    .limit(1);
  return !!entry;
}

export interface Room {
  id: string;
  creatorId: string;
  name?: string;
  createdAt: Date;
  deadline: Date;
  notificationJobId?: string;
  summary?: string;
  finishedAt?: Date;
}

interface DatabaseRoom {
  id: string;
  creator_id: string;
  name?: string;
  created_at: string;
  deadline: string;
  notification_job_id?: string;
  summary?: string;
  finished_at?: string;
}

function convertDatabaseRoom(room: DatabaseRoom): Room {
  return {
    id: room.id,
    creatorId: room.creator_id,
    name: room.name,
    createdAt: new Date(room.created_at),
    deadline: new Date(room.deadline),
    notificationJobId: room.notification_job_id,
    summary: room.summary,
    finishedAt: room.finished_at ? new Date(room.finished_at) : undefined,
  };
}
