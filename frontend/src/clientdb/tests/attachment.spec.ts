import { AttachmentEntity } from "../attachment";
import { MessageEntity } from "../message";
import { TopicEntity } from "../topic";
import { createTestAppClientDbWithData } from "./testDB";
import { makeMessage, makeTopic } from "./utils";
import { ClientDb } from "..";

describe("clientdb attachment", () => {
  let db: ClientDb;
  let topic: TopicEntity;
  let message: MessageEntity;
  let attachment: AttachmentEntity;

  beforeEach(async () => {
    const [_db] = await createTestAppClientDbWithData();
    db = _db;

    topic = await makeTopic(db);
    message = await makeMessage(db, { topic_id: topic.id });
    attachment = await db.attachment.create({
      message_id: message.id,
      mime_type: "image/jpeg",
      original_name: "file.jpg",
      transcription_id: null,
    });
  });

  afterEach(() => {
    db.destroy();
  });

  it("gets message", () => {
    expect(attachment.message).toBe(message);
  });

  it("returns null if no transcription exist", () => {
    expect(attachment.transcription).toBeNull();
  });

  it("gets the transcription", async () => {
    const transcription = await db.transcription.create({
      status: "completed",
      transcript: "Cheese have rights",
    });

    attachment.update({ transcription_id: transcription.id });

    expect(attachment.transcription).toBe(transcription);
  });
});
