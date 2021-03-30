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

if (!process.env.PRISMA_DATABASE_URL) {
  // trying to reconstruct PRISMA_DATABASE_URL,
  // if DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME is set
  if (
    ["DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME"].every((env) => Object.keys(process.env).includes(env))
  ) {
    process.env.PRISMA_DATABASE_URL = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`;
  } else {
    throw new Error("PRISMA_DATABASE_URL is required when importing @acaplea/db");
  }
}

export const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PRISMA_DATABASE_URL,
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function tsTest() {
  // Just testing if typescript types for client are properly generated
  db.user.findMany({ where: { account: { some: { id: "foo" } } } });
}
