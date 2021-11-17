import { MessageEntity } from "../message";
import { TopicEntity } from "../topic";
import { TopicEventEntity } from "../topicEvent";
import { UserEntity } from "../user";
import { createTestAppClientDbWithData } from "./testDB";
import { makeMessage, makeTopic } from "./utils";
import { ClientDb } from "..";

describe("clientdb topic event", () => {
  let db: ClientDb;
  let currentUser: UserEntity;
  let topic: TopicEntity;
  let message: MessageEntity;
  let topicEvent: TopicEventEntity;

  beforeEach(async () => {
    const [_db, { currentUser: _currentUser }] = await createTestAppClientDbWithData();
    db = _db;
    currentUser = _currentUser;
    topic = await makeTopic(db);
    message = await makeMessage(db, { topic_id: topic.id });
    topicEvent = await db.topicEvent.create({
      actor_id: currentUser.id,
      topic_id: topic.id,
    });
  });

  afterEach(() => {
    db.destroy();
  });

  it("gets the topic", () => {
    expect(topicEvent.topic).toBe(topic);
  });

  it("gets the actor", () => {
    expect(topicEvent.actor).toBe(currentUser);
  });

  it("gets message when due date event is about due date change", () => {
    expect(topicEvent.message).toBeNull();

    topicEvent.update({
      message_task_due_date_message_id: message.id,
    });

    expect(topicEvent.message).toBe(message);
  });
});
