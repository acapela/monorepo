import { firestore } from "firebase-admin";
import { NotificationName } from "./UserNotification";

export type lastSeenMessage = {
  [key: string]: number;
};

export type lastRemindedMessage = {
  [key: string]: number;
};

export type Thread = {
  checkedUsers: Array<string>;
  howls: Array<Message>;
  lastSeenMessage: lastSeenMessage;
  lastRemindedMessage: lastRemindedMessage;
  title: string;
  id: string;
  timeCreated: firestore.Timestamp;
};

export type NotificationStatus = {
  timeSent: firestore.Timestamp;
  notificationData?: Record<string, any>;
};

export type Participant = {
  notificationsStatus: {
    [key in NotificationName]?: NotificationStatus;
  };
  userId: string;
  email: string;
  name: string;
};

export type Room = {
  id: string;
  authorId: string;
  deadline: firestore.Timestamp;
  agendaPoints: Array<Thread>;
  title: string;
  participants: Array<Participant>;
};

export type Message = {
  author: string;
  text: string;
  timeSent: firestore.Timestamp;
};
