import { Message, Room, Thread } from "./domain";

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
        messages: unreadMessages.map((message) => {
          const sender = room.participants.find((participant) => participant.userId === message.author);
          return { ...message, author: sender?.name } as Message;
        }),
      });
    }
  }

  return allUnread;
}

export function getUncheckedThreads(room: Room, userId: string): Array<Thread> {
  return room.agendaPoints.filter((thread: Thread) => !thread.checkedUsers.includes(userId));
}

export function getRoomLink(roomId: string): string {
  return `${process.env.FRONTEND_URL}/room/${roomId}`;
}
