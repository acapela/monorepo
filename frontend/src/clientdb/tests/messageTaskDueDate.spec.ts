import { addDays } from "date-fns";

import { MessageEntity } from "../message";
import { MessageTaskDueDateEntity } from "../messageTaskDueDate";
import { TopicEntity } from "../topic";
import { createTestAppClientDbWithData } from "./testDB";
import { makeMessage, makeTopic } from "./utils";
import { ClientDb } from "..";

const now = new Date().toISOString();
describe("clientdb message task due date", () => {
  let db: ClientDb;

  let topic: TopicEntity;
  let message: MessageEntity;
  let messageTaskDueDate: MessageTaskDueDateEntity;

  beforeEach(async () => {
    const [_db] = await createTestAppClientDbWithData();
    db = _db;

    topic = await makeTopic(db);
    message = await makeMessage(db, { topic_id: topic.id });
    messageTaskDueDate = await db.messageTaskDueDate.create({
      message_id: message.id,
      due_at: now,
    });
  });

  afterEach(() => {
    db.destroy();
  });

  it("gets the topic", () => {
    expect(messageTaskDueDate.topic).toBe(topic);
  });

  it("creates a new topic event when new due date added", async () => {
    // From scratch
    const newTopic = await makeTopic(db);
    const newMessage = await makeMessage(db, { topic_id: newTopic.id });
    const latestDueDate = await db.messageTaskDueDate.create({
      message_id: newMessage.id,
      due_at: now,
    });

    const topicEvent = await db.topicEvent.query({ topic_id: newTopic.id }).first;

    expect(topicEvent?.getData()).toEqual(
      expect.objectContaining({
        topic_id: latestDueDate.topic.id,
        message_task_due_date_message_id: latestDueDate.message_id,
        message_task_due_date_from_due_at: null,
        message_task_due_date_to_due_at: latestDueDate.due_at,
      })
    );
  });

  it("creates a new topic event when a due date is updated", async () => {
    const previousDueDate = messageTaskDueDate.due_at;
    const updatedDueDate = addDays(new Date(), 1).toISOString();
    messageTaskDueDate.update({ due_at: updatedDueDate });

    const topicEvent = await db.topicEvent.query({ topic_id: messageTaskDueDate.topic.id }).last;

    expect(topicEvent?.getData()).toEqual(
      expect.objectContaining({
        topic_id: messageTaskDueDate.topic.id,
        message_task_due_date_message_id: messageTaskDueDate.message_id,
        message_task_due_date_from_due_at: previousDueDate,
        message_task_due_date_to_due_at: updatedDueDate,
      })
    );
  });

  it("creates a new topic event when a due date is removed", async () => {
    const previousDueDate = messageTaskDueDate.due_at;

    messageTaskDueDate.remove();

    const topicEvent = await db.topicEvent.query({ topic_id: messageTaskDueDate.topic.id }).last;

    expect(topicEvent?.getData()).toEqual(
      expect.objectContaining({
        topic_id: topic.id,
        message_task_due_date_message_id: message.id,
        message_task_due_date_from_due_at: previousDueDate,
        message_task_due_date_to_due_at: null,
      })
    );
  });
});
