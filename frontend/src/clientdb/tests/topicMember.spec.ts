import { TopicEntity } from "../topic";
import { TopicMemberEntity } from "../topicMember";
import { UserEntity } from "../user";
import { createTestAppClientDbWithData } from "./testDB";
import { makeTopic } from "./utils";
import { ClientDb } from "..";

describe("clientdb topic member", () => {
  let db: ClientDb;
  let currentUser: UserEntity;
  let topic: TopicEntity;
  let topicMember: TopicMemberEntity;

  beforeEach(async () => {
    const [_db, { currentUser: _currentUser }] = await createTestAppClientDbWithData();
    db = _db;
    currentUser = _currentUser;
    topic = await makeTopic(db);
    topicMember = await db.topicMember.create({
      topic_id: topic.id,
      user_id: currentUser.id,
    });
  });

  afterEach(() => {
    db.destroy();
  });

  it("gets the topic", () => {
    expect(topicMember.topic).toBe(topic);
  });

  it("gets the user", () => {
    expect(topicMember.user).toBe(currentUser);
  });
});
