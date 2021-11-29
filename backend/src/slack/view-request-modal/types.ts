import { RequestType } from "~shared/types/mention";

export interface SlackMember {
  slackUserId?: string;
  userId?: string;
  name: string;
}

export interface TaskInfo {
  id: string;
  user: SlackMember;
  type: RequestType;
  doneAt?: Date;
}

export interface MessageInfo {
  message: { id: string; content: string; fromUser: SlackMember; createdAt: Date; fromUserImage?: string };
  dueDate?: Date;
  tasks?: TaskInfo[];
}

export interface TopicInfo {
  id: string;
  url: string;
  slackUserId: string;
  name: string;
  isClosed: boolean;
  messages: MessageInfo[];
  slackMessagePermalink?: string;
}
