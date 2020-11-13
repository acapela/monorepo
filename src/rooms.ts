import { v4 as uuid } from "uuid";
import database from "./database";

export async function findRoomById(roomId: string): Promise<Room | null> {
  const [databaseRoom] = await database
    .select(["id", "creator_id", "name", "created_at", "deadline", "notification_job_id", "summary", "is_finished"])
    .from("room")
    .where({ id: roomId })
    .limit(1);

  if (databaseRoom) {
    return convertDatabaseRoom(databaseRoom);
  }

  return null;
}

export async function createRoom({ creatorId, name }: { creatorId: string; name: string }): Promise<Room> {
  const [databaseUser] = await database("room")
    .insert({
      id: uuid(),
      creator_id: creatorId,
      name,
    })
    .returning(["id", "creator_id", "name", "created_at", "deadline", "notification_job_id", "summary", "is_finished"]);
  return convertDatabaseRoom(databaseUser);
}

export interface Room {
  id: string;
  creatorId: string;
  name?: string;
  createdAt: Date;
  deadline: Date;
  notificationJobId?: string;
  summary?: string;
}

interface DatabaseRoom {
  id: string;
  creator_id: string;
  name?: string;
  created_at: Date;
  deadline: Date;
  notification_job_id?: string;
  summary?: string;
}

function convertDatabaseRoom(databaseUser: DatabaseRoom): Room {
  return {
    id: databaseUser.id,
    creatorId: databaseUser.creator_id,
    name: databaseUser.name,
    createdAt: databaseUser.created_at,
    deadline: databaseUser.deadline,
    notificationJobId: databaseUser.notification_job_id,
    summary: databaseUser.summary,
  };
}
