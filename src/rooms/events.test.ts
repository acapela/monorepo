import { setupServer } from "../app";
import { addParticipant, createRoom, getIfParticipantExists, Room } from "./rooms";
import { createUser, User } from "../users/users";
import { HasuraEventOperation } from "../events/events";
import { HttpStatus } from "../http";
import { sendEvent } from "../events/eventTestSupport";

describe("Room events", () => {
  const app = setupServer();
  let user: User;

  beforeEach(async () => {
    user = await createUser({
      email: "some-test@example.com",
      firebaseId: "test-some-firebase-id",
      name: "Test user",
    });
  });

  it("add the creator to the room participants once a room is created", async () => {
    const room = await createRoom({
      creatorId: user.id,
      name: "test room",
    });
    expect(await getIfParticipantExists(room.id, user.id)).toBe(false);
    await sendRoomCreation(user.id, room).expect(HttpStatus.OK);
    expect(await getIfParticipantExists(room.id, user.id)).toBe(true);
  });

  it("do not fail if the creator is already a participant, so the event is idempotent", async () => {
    const room = await createRoom({
      creatorId: user.id,
      name: "test room",
    });
    await addParticipant(room.id, user.id);
    await sendRoomCreation(user.id, room).expect(HttpStatus.OK);
  });

  it("fail if somehow the user creating the event differs from the room creator", async () => {
    const secondUser = await createUser({
      email: "some-other-test@example.com",
      firebaseId: "firebase-id",
      name: "another test user",
    });
    const room = await createRoom({
      creatorId: secondUser.id,
      name: "test room",
    });
    await sendRoomCreation(user.id, room).expect(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  function sendRoomCreation(userId: string, room: Room) {
    return sendEvent(app, "room_created", {
      op: HasuraEventOperation.INSERT,
      newData: {
        id: room.id,
        creator_id: room.creatorId,
      },
      userId,
    });
  }
});
