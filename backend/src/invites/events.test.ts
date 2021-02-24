import { v4 as uuid } from "uuid";
import sendgrid from "@sendgrid/mail";
import { setupServer } from "../app";
import { createRoom, Room } from "../rooms/rooms";
import { createUser, User } from "../users/users";
import { HasuraEventOperation } from "../events/events";
import { HttpStatus } from "../http";
import { sendEvent } from "../events/eventTestSupport";
import config from "../config";

jest.mock("@sendgrid/mail", () => ({
  send: jest.fn(() => Promise.resolve()),
  setApiKey: jest.fn(),
}));

describe("Invite events", () => {
  const app = setupServer();
  let user: User;
  let room: Room;

  beforeEach(async () => {
    user = await createUser({
      email: "some-test@example.com",
      firebaseId: "test-some-firebase-id",
      name: "Test user",
    });
    room = await createRoom({
      creatorId: user.id,
      name: "test room",
    });
    jest.resetAllMocks();
  });

  it("sends an email with the invite along with information about the sender and the room and the invite link", async () => {
    expect(sendgrid.send).not.toHaveBeenCalled();
    const code = uuid();
    await sendInviteCreation(user.id, {
      inviterId: user.id,
      email: "test@example.com",
      code,
      roomId: room.id,
    }).expect(HttpStatus.OK);
    expect(sendgrid.send).toHaveBeenCalled();
    const mailParams = (sendgrid.send as any).mock.calls[0][0];
    expect(mailParams.to).toEqual("test@example.com");
    expect(mailParams.subject).toContain("Test");
    expect(mailParams.subject).toContain(room.name);
    expect(mailParams.html).toContain(`${config.get("app.url")}/invites/${code}`);
  });

  it("fails if the invite creator does not match the event creator", async () => {
    await sendInviteCreation(uuid(), {
      inviterId: user.id,
      email: "test@example.com",
      code: uuid(),
      roomId: room.id,
    }).expect(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(sendgrid.send).not.toHaveBeenCalled();
  });

  it("fails if the sender cannot be found", async () => {
    const sender = uuid();
    await sendInviteCreation(sender, {
      inviterId: sender,
      email: "test@example.com",
      code: uuid(),
      roomId: room.id,
    }).expect(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(sendgrid.send).not.toHaveBeenCalled();
  });

  it("fails if the room cannot be found", async () => {
    await sendInviteCreation(user.id, {
      inviterId: user.id,
      email: "test@example.com",
      code: uuid(),
      roomId: uuid(),
    }).expect(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(sendgrid.send).not.toHaveBeenCalled();
  });

  function sendInviteCreation(
    userId: string,
    { roomId, code, email, inviterId }: { roomId: string; code: string; email: string; inviterId: string }
  ) {
    return sendEvent(app, "invite_created", {
      op: HasuraEventOperation.INSERT,
      newData: {
        id: uuid(),
        email,
        room_id: roomId,
        inviter_id: inviterId,
        code,
      },
      userId,
    });
  }
});
