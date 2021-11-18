import { MessageFragment, TaskFragment, TopicFragment, UserFragment } from "~gql";
import { getUUID } from "~shared/uuid";

import { ClientDb } from "..";

export async function makeUser(db: ClientDb, props: Partial<UserFragment> = {}) {
  const id = getUUID();
  return db.user.create({
    email: `${id}@acape.la`,
    name: `UID=>${id}`,
    id,
    avatar_url: null,
    has_account: true,
    ...props,
  });
}
export async function makeTopic(db: ClientDb, props: Partial<TopicFragment> = {}) {
  return db.topic.create({
    name: "Hello World!",
    slug: "hello-world",
    ...props,
  });
}

export async function makeMessage(db: ClientDb, props: Partial<MessageFragment> = {}) {
  return db.message.create({
    type: "TEXT",
    content: "",
    ...props,
  });
}

export async function makeTask(db: ClientDb, props: Partial<TaskFragment> = {}) {
  return db.task.create({
    type: "request-read",
    ...props,
  });
}
