import { LastSeenMessageEntity } from "../lastSeenMessage";
import { MessageEntity } from "../message";
import { TopicEntity } from "../topic";
import { createTestAppClientDbWithData } from "./testDB";
import { makeMessage, makeTopic } from "./utils";
import { ClientDb } from "..";

const now = new Date().toISOString();
describe("last seen message", () => {
  let db: ClientDb;

  let topic: TopicEntity;
  let message: MessageEntity;
  let lastSeenMessage: LastSeenMessageEntity;

  beforeEach(async () => {
    const [_db] = await createTestAppClientDbWithData();
    db = _db;

    topic = await makeTopic(db);
    message = await makeMessage(db, { topic_id: topic.id });
    lastSeenMessage = await db.lastSeenMessage.create({
      message_id: message.id,
      topic_id: topic.id,
      seen_at: now,
    });
  });

  afterEach(() => {
    db.destroy();
  });

  it("gets the message", () => {
    expect(lastSeenMessage.message).toBe(message);
  });

  it("gets the topic", () => {
    expect(lastSeenMessage.topic).toBe(topic);
  });
});
