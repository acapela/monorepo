import { JSONContent } from "@tiptap/react";
import { Task, Team, Topic, User, db } from "~db";
import { RichEditorMentionNode } from "~shared/editor/mentions";
import { slugify } from "~shared/slugify";
import { REQUEST_TYPES, RequestType } from "~shared/types/mention";
import { addDays, addHours, subMonths } from "date-fns";
import faker from "faker";
import { sample, sampleSize } from "lodash";

import { getDaysAgoDate, getMonthsAgoDate } from "./dateUtils";

function createMentionNodeForTask(task: TaskDraft): RichEditorMentionNode {
  return {
    type: "mention",
    attrs: {
      data: {
        type: task.type,
        userId: task.userId,
      },
    },
  };
}

interface TaskDraft {
  userId: string;
  type: RequestType;
}

function getRandomMessageContent(tasksFor: User[]): [JSONContent, TaskDraft[]] {
  const paragraphsCount = getRandomInt(1, 5);

  const taskDrafts: TaskDraft[] = tasksFor.map((user) => {
    return {
      type: sample(REQUEST_TYPES)!,
      userId: user.id,
    };
  });

  const taskMentionNodes = taskDrafts.map(createMentionNodeForTask);

  const paragraphsNodes = nLongArray(paragraphsCount).map((): JSONContent => {
    const content = faker.lorem.paragraph(getRandomInt(1, 5));

    return {
      type: "paragraph",
      content: [{ type: "text", text: content }],
    };
  });

  const mentionsParagraphNode: JSONContent = {
    type: "paragraph",
    content: taskMentionNodes,
  };

  const content = {
    type: "doc",
    content: [...paragraphsNodes, mentionsParagraphNode],
  };

  return [content, taskDrafts];
}

export async function createRandomMessageWithTasks(author: User, tasksFor: User[], topic: Topic, date: Date) {
  const [content, taskDrafts] = getRandomMessageContent(tasksFor);

  const message = await db.message.create({
    data: {
      created_at: date,
      content,
      user_id: author.id,
      topic_id: topic.id,
      type: "TEXT",
      updated_at: date,
    },
  });
  taskDrafts.map((taskDraft) => {
    const isDone = getRandomBool(0.9);
    const doneDate = isDone ? addHours(date, getRandomInt(1, 5)) : null;
    db.task.create({
      data: {
        user_id: taskDraft.userId,
        type: taskDraft.type,
        created_at: date,
        updated_at: date,
        message_id: message.id,
      },
    });
  });
}

export async function createRandomMessagesWithTasks(participants: User[], topic: Topic, count: number) {
  const startDate = new Date(topic.created_at!);
  const endDate = addDays(startDate, 5);
  const messageDates = faker.date.betweens(startDate, endDate, getRandomInt(3, 10));

  messageDates.map((messageDate) => {
    const author = sample(participants)!;
    const tasksFor = pickRandomSizeSample(participants, 1, participants.length * 0.8, author);

    return createRandomMessageWithTasks(author, tasksFor, topic);
  });
}

export async function createRandomUser(team: Team) {
  return db.user.create({
    data: {
      email,
      name,
      avatar_url,
    },
  });
}

export async function createRandomUsers(team: Team, count: number) {
  return db.user.create({
    data: {
      email,
      name,
      avatar_url,
    },
  });
}

export async function createRandomTopic(author: User, participants: User[], team: Team) {
  const name = faker.lorem.words(getRandomInt(3, 10));
  const slug = await slugify(name);
  const startDate = faker.date.between(getMonthsAgoDate(4), getDaysAgoDate(7));

  const isClosed = getRandomBool(0.7);
  const topic = await db.topic.create({
    data: {
      name,
      slug,
      index: "0",
      owner_id: author.id,
      created_at: startDate,
      updated_at: startDate,
      team_id: team.id,
    },
  });
}

async function createRandomTopics(team: Team, count: number) {
  const teamMembers = await db.team_member.findMany({ where: { team_id: team.id }, select: { user: true } });

  const users = teamMembers.map((member) => member.user);

  const participantsMin = 1;
  const participantsMax = Math.floor(users.length * 0.7);

  const promises = nLongArray(count).map(() => {
    const author = sample(users)!;

    const participants = pickRandomSizeSample(users, participantsMin, participantsMax, author);

    return createRandomTopic(author, participants);
  });

  await Promise.all(promises);
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomBool(likelinessOfTrue = 0.5) {
  return Math.random() < likelinessOfTrue;
}

function pickRandomSizeSample<T>(list: T[], min: number, max: number, exclude?: T) {
  const count = getRandomInt(min, max);
  return sampleSize(list, count);
}

function nLongArray(length: number) {
  return Array.from({ length }).map((_, index) => index);
}
