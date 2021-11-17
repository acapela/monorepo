import { MessageEntity } from "../message";
import { TaskEntity } from "../task";
import { TopicEntity } from "../topic";
import { UserEntity } from "../user";
import { createTestAppClientDbWithData } from "./testDB";
import { makeMessage, makeTask, makeTopic, makeUser } from "./utils";
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
    topic = await makeTopic(db);
    message = await makeMessage(db, { topic_id: topic.id });
    task = await makeTask(db, {
      message_id: message.id,
      user_id: currentUser.id,
    });
  });

  afterEach(() => {
    db.destroy();
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
    const taskOwner = await makeUser(db);

    // Task owner is the same as parent message owner
    message.update({ user_id: taskOwner.id });

    expect(task.creatingUser).toBe(taskOwner);
  });

  it("is self created when current user is task owner", () => {
    expect(task.isSelfCreated).toBeTruthy();
  });

  it("is not self created when current user is not task owner", async () => {
    const taskOwner = await makeUser(db);

    // Task owner is the same as parent message owner
    message.update({ user_id: taskOwner.id });

    expect(task.isSelfCreated).toBeFalsy();
  });

  it("gets the assigned user", () => {
    expect(task.assignedUser).toBe(currentUser);
  });
});
