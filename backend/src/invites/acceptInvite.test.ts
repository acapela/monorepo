import request from "supertest";
import { v4 as uuid } from "uuid";
import { Server } from "http";

import { setupServer } from "../app";
import { HttpStatus } from "../http";

import { AcceptInviteActionInputs } from "./acceptInvite";
import { HasuraAction } from "../actions/actions";
import { createInviteForTests as createInvite, findInviteByCode } from "./invites";
import { addParticipant, createRoom, getIfParticipantExists, Room } from "../rooms/rooms";
import { createUser, User } from "../users/users";

describe("Accepting invites", () => {
  let app: Server;

  it("setup server", async () => {
    app = await setupServer();
  });

  let firstUser: User;
  let secondUser: User;
  let room: Room;

  beforeEach(async () => {
    [firstUser, secondUser] = await Promise.all([
      createUser({
        email: "test@example.com",
        name: "Test user",
      }),
      createUser({
        email: "test-2@example.com",
        name: "Test user 2",
      }),
    ]);
    room = await createRoom({
      creatorId: firstUser.id,
      name: "Test room",
    });
  });

  it("uses the invite and adds the user to the room participants", async () => {
    const invite = await createInvite({
      roomId: room.id,
      inviterId: firstUser.id,
      email: secondUser.email!,
    });
    expect(await getIfParticipantExists(room.id, secondUser.id)).toBe(false);
    expect(await inviteUsedWithCode(invite.code)).toBe(false);

    await acceptInvite(secondUser.id, invite.code).expect(HttpStatus.OK, {
      room_id: room.id,
      invite_id: invite.id,
    });

    expect(await getIfParticipantExists(room.id, secondUser.id)).toBe(true);
    expect(await inviteUsedWithCode(invite.code)).toBe(true);
  });

  it("returns not found for unknown invite code", async () => {
    await acceptInvite(secondUser.id, uuid())
      .expect(HttpStatus.NOT_FOUND)
      .expect(({ body }) => {
        expect(body.code).toBe("404");
        expect(body.message).toMatch(/invite not found/gi);
      });
  });

  it("does not let you use an already used invite code", async () => {
    const invite = await createInvite({
      roomId: room.id,
      inviterId: firstUser.id,
      email: secondUser.email!,
    });
    await acceptInvite(secondUser.id, invite.code).expect(HttpStatus.OK);

    await acceptInvite(secondUser.id, invite.code)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY)
      .expect(({ body }) => {
        expect(body.code).toBe("422");
        expect(body.message).toMatch(/already been used/gi);
      });
  });

  it("does not let you accept an invite where you are already in the room", async () => {
    const invite = await createInvite({
      roomId: room.id,
      inviterId: firstUser.id,
      email: secondUser.email!,
    });
    await addParticipant(room.id, secondUser.id);

    await acceptInvite(secondUser.id, invite.code)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY)
      .expect(({ body }) => {
        expect(body.code).toBe("422");
        expect(body.message).toMatch(/already a participant/gi);
      });
  });

  it("handles malformed invite codes", async () => {
    await acceptInvite(secondUser.id, "oh no")
      .expect(HttpStatus.UNPROCESSABLE_ENTITY)
      .expect(({ body }) => {
        expect(body.code).toBe("422");
        expect(body.message).toMatch(/malformed invite code/gi);
      });
  });

  function acceptInvite(userId: string, code: string) {
    return request(app)
      .post("/api/v1/actions")
      .set("Authorization", "Bearer dev-action-secret")
      .send(acceptInviteRequest(userId, code));
  }
});

async function inviteUsedWithCode(code: string): Promise<boolean> {
  const invite = await findInviteByCode(code);
  return !!invite!.usedAt;
}

function acceptInviteRequest(userId: string, code: string): HasuraAction<"accept_invite", AcceptInviteActionInputs> {
  return {
    action: {
      name: "accept_invite",
    },
    input: {
      code,
    },
    session_variables: {
      "x-hasura-user-id": userId,
    },
  };
}
