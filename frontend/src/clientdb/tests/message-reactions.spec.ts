import { MessageEntity } from "../message";
import { MessageReactionEntity } from "../messageReaction";
import { TopicEntity } from "../topic";
import { UserEntity } from "../user";
import { createTestAppClientDbWithData } from "./testDB";
import { makeMessage, makeTopic, makeUser } from "./utils";
import { ClientDb } from "..";

describe("clientdb message reactions", () => {
  let db: ClientDb;
  let currentUser: UserEntity;
  let topic: TopicEntity;
  let message: MessageEntity;
  let messageReaction: MessageReactionEntity;

  beforeEach(async () => {
    const [_db, { currentUser: _currentUser }] = await createTestAppClientDbWithData();
    db = _db;
    currentUser = _currentUser;
    topic = await makeTopic(db);
    message = await makeMessage(db, { topic_id: topic.id });
    messageReaction = await db.messageReaction.create({
      message_id: message.id,
      user_id: currentUser.id,
      emoji: "✌️",
    });
  });

  it("gets a message", () => {
    expect(messageReaction.message).toBe(message);
  });

  it("gets the user", () => {
    expect(messageReaction.user).toBe(currentUser);
  });

  it("is own message if the current user created the reaction", () => {
    expect(messageReaction.isOwn).toBeTruthy();
  });

  it("is not own message if the current user did not create the reaction", async () => {
    const otherOwner = await makeUser(db);
    messageReaction.update({ user_id: otherOwner.id });
    expect(messageReaction.isOwn).toBeFalsy();
  });
});
