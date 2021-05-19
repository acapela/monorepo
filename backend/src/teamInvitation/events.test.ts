import sendgrid from "@sendgrid/mail";
import { Server } from "http";
import { v4 as uuid } from "uuid";
import { Room, User } from "~db";
import { setupServer } from "../app";
import { HasuraEventOperation } from "../events/events";
import { sendEvent } from "../events/eventTestSupport";
import { HttpStatus } from "../http";
import { createRoom } from "../rooms/rooms";
import { createUser } from "../users/users";

jest.mock("@sendgrid/mail", () => ({
  send: jest.fn(() => Promise.resolve()),
  setApiKey: jest.fn(),
}));

describe("Invite events", () => {
  let app: Server;

  it("setup server", async () => {
    app = await setupServer();
  });

  let user: User;
  let room: Room;

  beforeEach(async () => {
    user = await createUser({
      email: "some-test@example.com",
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
    expect(mailParams.html).toContain(`${process.env.FRONTEND_URL}/invites/${code}`);
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
