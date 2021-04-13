import { PrismaClient } from "@prisma/client";
import logger from "~shared/logger";

export type {
  account as Account,
  message as Message,
  message_type as MessageType,
  room as Room,
  room_invites as RoomInvites,
  room_participants as RoomParticipants,
  thread as Thread,
  user as User,
  verification_requests as VerificationRequest,
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

const prismaDatabaseUrl = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`;

export const db = new PrismaClient({
  datasources: {
    db: {
      url: prismaDatabaseUrl,
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function tsTest() {
  // Just testing if typescript types for client are properly generated
  db.user.findMany({ where: { account: { some: { id: "foo" } } } });
}
