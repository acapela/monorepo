import { subDays } from "date-fns";

import { MessageEntity } from "../message";
import { TopicEntity } from "../topic";
import { UserEntity } from "../user";
import { createTestAppClientDbWithData } from "./testDB";
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
    topic = await db.topic.create({
      name: "Hello World!",
      slug: "hello-world",
    });
    message = await db.message.create({
      topic_id: topic.id,
      type: "TEXT",
      content: "",
    });
  });

  it("links to its parent topic", async () => {
    expect(message.topic).toBe(topic);
  });

  it("links to the user that created that message", async () => {
    expect(message.user).toBe(currentUser);
  });

  it("returns all the tasks related to that message", async () => {
    const firstTask = await db.task.create({
      message_id: message.id,
      user_id: currentUser.id,
      type: "request-read",
    });

    const secondTask = await db.task.create({
      message_id: message.id,
      user_id: currentUser.id,
      type: "request-read",
    });

    expect(message.tasks.all).toEqual([firstTask, secondTask]);
  });

  describe("message user is participating when user", () => {
    it("is the message owner", () => {
      expect(message.getIsUserParticipating(currentUser.id)).toBeTruthy();
    });

    it("has tasks assigned", async () => {
      const userWithTaskAssigned = await db.user.create({
        email: "me@acape.la",
        name: "Acapela user",
        id: "other-user",
        avatar_url: null,
        has_account: true,
      });

      await db.task.create({
        message_id: message.id,
        user_id: userWithTaskAssigned.id,
        type: "request-read",
      });

      expect(message.getIsUserParticipating(userWithTaskAssigned.id)).toBeTruthy();
    });

    it("has been mentioned", async () => {
      const userWithMention = await db.user.create({
        email: "me@acape.la",
        name: "Acapela user",
        id: "other-user",
        avatar_url: null,
        has_account: true,
      });

      message.update({ content: mockMentionMessageContent(userWithMention.id, "observer") });

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
      const otherUser = await db.user.create({
        email: "me@acape.la",
        name: "Acapela user",
        id: "other-user",
        avatar_url: null,
        has_account: true,
      });

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
