import { PrismaClient } from "@prisma/client";
import { assert } from "~shared/assert";

export type {
  account as Account,
  message as Message,
  message_type as MessageType,
  room as Room,
  room_invites as RoomInvites,
  room_member as RoomParticipants,
  topic as Topic,
  user as User,
  verification_requests as VerificationRequest,
  attachment as Attachment,
  transcription_status as TranscriptionStatus,
  transcription as Transcription,
  team as Team,
  space as Space,
  team_invitation as TeamInvitation,
  membership_status as MembershipStatus,
  topic_member as TopicMember,
  space_member as SpaceMember,
  team_member as TeamMember,
  whitelist as Whitelist,
} from "@prisma/client";

assert(process.env.DB_HOST, "DB_HOST required");
assert(process.env.DB_PORT, "DB_PORT required");
assert(process.env.DB_USER, "DB_USER required");
assert(process.env.DB_PASSWORD, "DB_PASSWORD required");
assert(process.env.DB_NAME, "DB_NAME required");

const prismaDatabaseUrl = `postgresql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${
  process.env.DB_HOST
}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`;

export const db = new PrismaClient({
  datasources: {
    db: {
      url: prismaDatabaseUrl,
    },
  },
});

declare global {
  /* eslint-disable @typescript-eslint/prefer-namespace-keyword */
  /* eslint-disable @typescript-eslint/no-namespace */
  module globalThis {
    // eslint-disable-next-line no-var
    var dbInstance: PrismaClient | null;
  }
}

/**
 * In dev, this file gets hot-reloaded frequently (on each file change that impacts apis). It means we'll constantly
 * create new instance of db connection.
 *
 * To avoid this we need to save old instance somewhere out of module scope (which is re-created on hot-reload).
 *
 * Let's do globalThis for this.
 */
if (process.env.NODE_ENV === "development") {
  // If there is old instance, disconnect it.
  if (globalThis.dbInstance) {
    globalThis.dbInstance.$disconnect();
    globalThis.dbInstance = null;
  }

  globalThis.dbInstance = db;
}
