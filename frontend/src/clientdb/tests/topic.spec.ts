import { subDays, subHours } from "date-fns";

import { TeamEntity } from "../team";
import { TopicEntity } from "../topic";
import { UserEntity } from "../user";
import { createTestAppClientDbWithData } from "./testDB";
import { makeMessage, makeTask, makeTopic, makeUser } from "./utils";
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
    topic = await makeTopic(db);
  });

  afterEach(() => {
    db.destroy();
  });

  it("gets the last seen message info and a list of all unread messages", async () => {
    const userThatSendsMessage = await makeUser(db);

    const seenMessage = await makeMessage(db, {
      user_id: userThatSendsMessage.id,
      topic_id: topic.id,
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

    const unSeenMessage = await makeMessage(db, {
      user_id: userThatSendsMessage.id,
      topic_id: topic.id,
    });

    expect(topic.lastSeenMessageByCurrentUserInfo).toBe(lastSeen);
    expect(topic.unreadMessages.all).toEqual([unSeenMessage]);
  });

  it("gets all topic members", async () => {
    const randomTeamMember = await makeUser(db);

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
    expect(topic.closedByUser).not.toBeNull();
    expect(topic.closed_at).not.toBeNull();

    topic.open();
    expect(topic.closedByUser).toBeNull();
    expect(topic.closed_at).toBeNull();
  });

  it("gets all tasks", async () => {
    const firstMessage = await makeMessage(db, { topic_id: topic.id });

    const firstTask = await makeTask(db, {
      message_id: firstMessage.id,
      user_id: currentUser.id,
    });

    const secondMessage = await makeMessage(db, {
      topic_id: topic.id,
    });

    const secondTask = await makeTask(db, {
      message_id: secondMessage.id,
      user_id: currentUser.id,
    });

    expect(topic.tasks.all).toEqual([firstTask, secondTask]);
  });

  describe("on topic is updated", () => {
    it("creates a topic event when topic is renamed", async () => {
      const previousName = topic.name;
      const newName = "new name";
      topic.update({ name: newName });

      const topicEvent = await db.topicEvent.query({ topic_id: topic.id }).last;

      expect(topicEvent?.getData()).toEqual(
        expect.objectContaining({
          topic_id: topic.id,
          topic_from_name: previousName,
          topic_to_name: newName,
        })
      );
    });

    it("creates a topic event when a topic is closed", async () => {
      topic.close();

      const closedAt = topic.closed_at;

      const topicEvent = await db.topicEvent.query({ topic_id: topic.id }).last;

      expect(topicEvent?.getData()).toEqual(
        expect.objectContaining({
          topic_id: topic.id,
          topic_from_closed_at: null,
          topic_to_closed_at: closedAt,
        })
      );
    });

    it("creates a topic event when a topic is re-opened", async () => {
      topic.close();

      const previousClosedAt = topic.closed_at;

      topic.open();

      const topicEvent = await db.topicEvent.query({ topic_id: topic.id }).last;

      expect(topicEvent?.getData()).toEqual(
        expect.objectContaining({
          topic_id: topic.id,
          topic_from_closed_at: previousClosedAt,
          topic_to_closed_at: null,
        })
      );
    });

    it("creates a topic event when a topic is archived", async () => {
      const archived_at = new Date().toISOString();

      topic.update({ archived_at });

      const topicEvent = await db.topicEvent.query({ topic_id: topic.id }).last;

      expect(topicEvent?.getData()).toEqual(
        expect.objectContaining({
          topic_id: topic.id,
          topic_from_archived_at: null,
          topic_to_archived_at: archived_at,
        })
      );
    });

    it("creates a topic event when a topic is un-archived", async () => {
      const previousArchivedDate = new Date().toISOString();

      topic.update({ archived_at: previousArchivedDate });

      topic.update({ archived_at: null });

      const topicEvent = await db.topicEvent.query({ topic_id: topic.id }).last;

      expect(topicEvent?.getData()).toEqual(
        expect.objectContaining({
          topic_id: topic.id,
          topic_from_archived_at: previousArchivedDate,
          topic_to_archived_at: null,
        })
      );
    });
  });
});
