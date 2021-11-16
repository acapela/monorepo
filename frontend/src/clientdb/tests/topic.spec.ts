import { subDays, subHours } from "date-fns";

import { TeamEntity } from "../team";
import { TopicEntity } from "../topic";
import { UserEntity } from "../user";
import { createTestAppClientDbWithData } from "./testDB";
import { ClientDb } from "..";

const now = new Date();
const aDayAgo = subDays(now, 1).toISOString();
const anHourAgo = subHours(now, 1).toISOString();

describe("clientdb topic", () => {
  let db: ClientDb;
  let team: TeamEntity;
  let currentUser: UserEntity;
  let topic: TopicEntity;

  beforeEach(async () => {
    const [_db, { currentUser: _currentUser, team: _team }] = await createTestAppClientDbWithData();
    db = _db;
    team = _team;
    currentUser = _currentUser;
    topic = await db.topic.create({
      name: "Hello World!",
      slug: "hello-world",
    });
  });

  it("gets the last seen message info and a list of all unread messages", async () => {
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

  it("gets all topic members", async () => {
    const randomTeamMember = await db.user.create({
      email: "me@acape.la",
      name: "Acapela user",
      id: "other-user",
      avatar_url: null,
      has_account: true,
    });
    await db.teamMember.create({
      has_joined: true,
      team_id: team.id,
      user_id: randomTeamMember.id,
      notify_email: false,
      notify_slack: false,
    });
    expect(topic.members).toContain(currentUser);
    expect(topic.members).not.toContain(randomTeamMember);
  });

  it("closes a topic", async () => {
    topic.close();

    expect(topic.closedByUser).toBe(currentUser);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(new Date(topic.closed_at!)).toBeRecent();
  });

  it("opens a topic", async () => {
    topic.close();
    topic.open();

    expect(topic.closedByUser).toBeNull();
    expect(topic.closed_at).toBeNull();
  });
});
