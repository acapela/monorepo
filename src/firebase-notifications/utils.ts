import { Room, Thread, Message } from "./domain";
import admin from "../firebase";
import config from "../config";

export function isRoomExpired(room: Room): boolean {
  return room.deadline.toDate() < new Date();
}

export type UnreadMessagesInThread = { thread: Thread; messages: Array<Message> };

export function getUnreadMessages(room: Room, userId: string): Array<UnreadMessagesInThread> {
  const allUnread: Array<UnreadMessagesInThread> = [];

  for (const thread of room.agendaPoints) {
    const unreadMessages: Array<Message> = [...thread.howls];
    unreadMessages.splice(0, thread.lastSeenMessage[userId]);

    if (unreadMessages.length) {
      allUnread.push({
        thread,
        messages: unreadMessages,
      });
    }
  }

  return allUnread;
}

export function getUncheckedThreads(room: Room, userId: string): Array<Thread> {
  return room.agendaPoints.filter((thread: Thread) => !thread.checkedUsers.includes(userId));
}

export function generateMagicLinkToRoom(email: string, roomId: string): Promise<string> {
  const encodedEmail = Buffer.from(email).toString("base64");
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for
    // this URL must be whitelisted in the Firebase Console.
    url: `${config.get("app.url")}/room/${roomId}?user=${encodedEmail}`,
    // This must be true for email link sign-in.
    handleCodeInApp: true,
  };

  return admin.auth().generateSignInWithEmailLink(email, actionCodeSettings);
}
