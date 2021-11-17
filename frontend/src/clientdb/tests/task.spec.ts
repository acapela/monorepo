import { MessageEntity } from "../message";
import { TaskEntity } from "../task";
import { TopicEntity } from "../topic";
import { UserEntity } from "../user";
import { createTestAppClientDbWithData } from "./testDB";
import { ClientDb } from "..";

describe("clientdb task", () => {
  let db: ClientDb;
  let currentUser: UserEntity;
  let topic: TopicEntity;
  let message: MessageEntity;
  let task: TaskEntity;

  beforeEach(async () => {
    const [_db, { currentUser: _currentUser }] = await createTestAppClientDbWithData();
    db = _db;
    currentUser = _currentUser;
    topic = await db.topic.create({
      name: "Hello World!",
      slug: "hello-world",
    });
    message = await db.message.create({
      topic_id: topic.id,
      type: "TEXT",
      content: "",
    });
    task = await db.task.create({
      message_id: message.id,
      user_id: currentUser.id,
      type: "request-read",
    });
  });

  it("gets the parent message", () => {
    expect(task.message).toBe(message);
  });

  it("gets the parent topic", () => {
    expect(task.topic).toBe(topic);
  });

  it("gets the due date", async () => {
    const now = new Date().toISOString();
    await db.messageTaskDueDate.create({
      message_id: message.id,
      due_at: new Date().toISOString(),
    });
    expect(task.hasDueDate).toBeTruthy();
    expect(task.dueDate).toEqual(new Date(now));
  });

  it("gets the user that created the task", async () => {
    const taskOwner = await db.user.create({
      email: "me@acape.la",
      name: "Acapela user",
      id: "other-user",
      avatar_url: null,
      has_account: true,
    });

    // Task owner is the same as parent message owner
    message.update({ user_id: taskOwner.id });

    expect(task.creatingUser).toBe(taskOwner);
  });

  it("is self created when current user is task owner", () => {
    expect(task.isSelfCreated).toBeTruthy();
  });

  it("is not self created when current user is not task owner", async () => {
    const taskOwner = await db.user.create({
      email: "me@acape.la",
      name: "Acapela user",
      id: "other-user",
      avatar_url: null,
      has_account: true,
    });

    // Task owner is the same as parent message owner
    message.update({ user_id: taskOwner.id });

    expect(task.isSelfCreated).toBeFalsy();
  });

  it("gets the assigned user", () => {
    expect(task.assignedUser).toBe(currentUser);
  });
});
