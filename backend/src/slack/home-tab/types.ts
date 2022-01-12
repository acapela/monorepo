import { Message, MessageTaskDueDate, Task, Topic, TopicMember, User } from "@aca/db";

export type UnreadMessage = {
  topic_id: string;
  unread_messages: number;
};

export type MessageWithOpenTask = Message & {
  user: User;
  task: Task[];
  message_task_due_date: MessageTaskDueDate | null;
};

export type TopicWithOpenTask = Topic & {
  user: User;
  message: MessageWithOpenTask[];
  topic_member: TopicMember[];
};
