import { Message, MessageTaskDueDate, Task, Topic, TopicMember, User } from "~db";

export type UnreadMessage = {
  topic_id: string;
  unread_messages: number;
};

export type TopicWithOpenTask = Topic & {
  user: User;
  message: (Message & { user: User; task: Task[]; message_task_due_date: MessageTaskDueDate | null })[];
  topic_member: TopicMember[];
};
