import logger from "@acapela/shared/logger";
import { PrismaClient } from "@prisma/client";

export type {
  // Let's export entities types
  account as Account,
  user as User,
  message as Message,
  room as Room,
  thread as Thread,
  message_type as MessageType,
  room_invites as RoomInvites,
  room_participants as RoomParticipants,
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
