import { subDays, subHours } from "date-fns";

import { createTestAppClientDbWithData } from "./testDB";

const now = new Date();
const aDayAgo = subDays(now, 1).toISOString();
const anHourAgo = subHours(now, 1).toISOString();

describe("clientdb topic", () => {
  it("creates a new topic", async () => {
    const [db, { currentUser }] = await createTestAppClientDbWithData();
    await db.topic.create({
      owner_id: currentUser.id,
      name: "Hello World!",
      slug: "hello-world",
    });
  });

  it("gets the last seen message info and a list of all unread messages", async () => {
    const [db, { currentUser }] = await createTestAppClientDbWithData();
    const topic = await db.topic.create({
      name: "Hello World!",
      slug: "hello-world",
    });

    const userThatSendsMessage = db.user.create({
      email: "me@acape.la",
      name: "Acapela user",
      id: "other-user",
      avatar_url: null,
      has_account: true,
    });

    const seenMessage = await db.message.create({
      user_id: userThatSendsMessage.id,
      topic_id: topic.id,
      type: "TEXT",
      content: "",
      created_at: aDayAgo,
      updated_at: aDayAgo,
    });

    const lastSeen = await db.lastSeenMessage.create({
      message_id: seenMessage.id,
      seen_at: anHourAgo,
      user_id: currentUser.id,
      topic_id: topic.id,
      updated_at: anHourAgo,
    });

    const unSeenMessage = await db.message.create({
      user_id: userThatSendsMessage.id,
      topic_id: topic.id,
      type: "TEXT",
      content: "",
    });

    expect(topic.lastSeenMessageByCurrentUserInfo).toBe(lastSeen);
    expect(topic.unreadMessages.all).toEqual([unSeenMessage]);
  });
});
