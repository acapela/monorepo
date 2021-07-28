import { PrismaClient } from "@prisma/client";
import logger from "~shared/logger";

export type {
  account as Account,
  message as Message,
  message_type as MessageType,
  room as Room,
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
  notification as Notification,
  PrismaPromise,
} from "@prisma/client";

const DB_VARS = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const ENV_VARS = Object.keys(process.env);

if (DB_VARS.some((key) => !ENV_VARS.includes(key))) {
  const error = new Error("Failed to construct database URL, check environment variables");
  const missingStr = "<missing>";

  logger.error(error.message, {
    DB_HOST: process.env.DB_HOST || missingStr,
    DB_PORT: process.env.DB_PORT || missingStr,
    DB_USER: process.env.DB_USER || missingStr,
    DB_PASSWORD: process.env.DB_PASSWORD || missingStr,
    DB_NAME: process.env.DB_NAME || missingStr,
  });

  throw error;
}

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
