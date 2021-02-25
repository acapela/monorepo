import { assertSecretsLoaded } from "@acapela/config";
import { PrismaClient } from "./client";
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
} from "./client";

assertSecretsLoaded("You cannot import prisma db before secrets are loaded.");

if (!process.env.PRISMA_DATABASE_URL) {
  throw new Error("PRISMA_DATABASE_URL is required when importing @acaplea/db");
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
