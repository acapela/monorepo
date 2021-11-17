import { subDays } from "date-fns";

import { MessageEntity } from "../message";
import { TopicEntity } from "../topic";
import { UserEntity } from "../user";
import { createTestAppClientDbWithData } from "./testDB";
import { makeMessage, makeTask, makeTopic, makeUser } from "./utils";
import { ClientDb } from "..";

function mockMentionMessageContent(userId: string, type = "request-response") {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "mention",
            attrs: { data: { type, userId } },
          },
        ],
      },
    ],
  };
}

const now = new Date().toISOString();
describe("clientdb message", () => {
  let db: ClientDb;
  let currentUser: UserEntity;
  let topic: TopicEntity;
  let message: MessageEntity;

  beforeEach(async () => {
    const [_db, { currentUser: _currentUser }] = await createTestAppClientDbWithData();
    db = _db;
    currentUser = _currentUser;
    topic = await makeTopic(db);
    message = await makeMessage(db, { topic_id: topic.id });
  });

  afterEach(() => {
    db.destroy();
  });

  it("links to its parent topic", async () => {
    expect(message.topic).toBe(topic);
  });

  it("links to the user that created that message", async () => {
    expect(message.user).toBe(currentUser);
  });

  it("returns all the tasks related to that message", async () => {
    const firstTask = await makeTask(db, {
      message_id: message.id,
      user_id: currentUser.id,
    });

    const otherUser = await makeUser(db);

    const secondTask = await makeTask(db, {
      message_id: message.id,
      user_id: otherUser.id,
    });

    expect(message.tasks.all).toEqual([firstTask, secondTask]);
  });

  describe("message user is participating when user", () => {
    it("is the message owner", () => {
      expect(message.getIsUserParticipating(currentUser.id)).toBeTruthy();
    });

    it("has tasks assigned", async () => {
      const userWithTaskAssigned = await makeUser(db);

      await makeTask(db, {
        message_id: message.id,
        user_id: userWithTaskAssigned.id,
      });

      expect(message.getIsUserParticipating(userWithTaskAssigned.id)).toBeTruthy();
    });

    it("has been mentioned", async () => {
      const userWithMention = await makeUser(db);

      message.update({ content: mockMentionMessageContent(userWithMention.id, "request-read") });

      expect(message.getIsUserParticipating(userWithMention.id)).toBeTruthy();
    });
  });

  it("gets reactions", async () => {
    const reaction = await db.messageReaction.create({
      message_id: message.id,
      emoji: "🆕",
    });

    expect(message.reactions.all).toEqual([reaction]);
  });

  it("gets attachments", async () => {
    const attachment = await db.attachment.create({
      message_id: message.id,
      mime_type: "image/jpeg",
      original_name: "file.jpg",
      transcription_id: null,
    });

    expect(message.attachments.all).toEqual([attachment]);
  });

  describe("is unread when", () => {
    // Change ownership to avoid unread ownership check
    beforeEach(async () => {
      const otherUser = await makeUser(db);

      message.update({ user_id: otherUser.id });
    });

    it("no message has been seen in topic", async () => {
      expect(message.isUnread).toBe(true);
    });

    it("current message is younger than last seen message in same topic", async () => {
      await db.lastSeenMessage.create({
        seen_at: subDays(new Date(), 1).toISOString(),
        message_id: "fake-message-id",
        topic_id: topic.id,
      });
      expect(message.isUnread).toBeTruthy();
    });
  });

  it("is read when when message owner is the current user", () => {
    expect(message.isUnread).toBeFalsy();
  });

  it("returns null when no due dates are set", () => {
    expect(message.dueDate).toBeNull();
  });

  it("gets the message due date", async () => {
    await db.messageTaskDueDate.create({ message_id: message.id, due_at: now });
    expect(message.dueDate).toEqual(new Date(now));
  });
});
