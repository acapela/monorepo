import request from "supertest";

import "../testSupport/testFirebase";
import { setupServer } from "../app";
import { HttpStatus } from "../http";
import { HasuraAction } from "../actions/actions";
import { createUser, User, findUserById } from "../users/users";
import firebase from "firebase-admin";

const mockFirebaseAuth = firebase.auth() as any;

describe("Upgrading the current user", () => {
  const app = setupServer();
  const firebaseId = "test-firebase-id";
  let user: User;

  beforeEach(async () => {
    user = await createUser({ firebaseId });
  });

  it("upgrades the current user with new information from firebase", async () => {
    mockFirebaseAuth.setFakeUserInfo(firebaseId, {
      uid: firebaseId,
      emailVerified: true,
      email: "uku@example.com",
      displayName: "Test Person",
      photoURL: "example.com/some-avatar",
    });
    expect((await findUserById(user.id))!.email).toBeFalsy();
    await request(app)
      .post("/api/v1/actions")
      .set("Authorization", "Bearer dev-action-secret")
      .send(upgradeUserRequest(user.id))
      .expect(HttpStatus.OK, { user_id: user.id });
    expect(await findUserById(user.id)).toEqual(
      expect.objectContaining({
        id: user.id,
        firebaseId,
        email: "uku@example.com",
        name: "Test Person",
        avatarUrl: "example.com/some-avatar",
      })
    );
  });

  it("throws an error if the firebase user has an email that is not verified", async () => {
    mockFirebaseAuth.setFakeUserInfo(firebaseId, {
      uid: firebaseId,
      emailVerified: false,
      email: "uku@example.com",
      displayName: "Test Person",
      photoURL: "example.com/some-avatar",
    });
    await request(app)
      .post("/api/v1/actions")
      .set("Authorization", "Bearer dev-action-secret")
      .send(upgradeUserRequest(user.id))
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(await findUserById(user.id)).toEqual(
      expect.objectContaining({
        id: user.id,
        firebaseId,
        email: null,
      })
    );
  });

  it("throws an error if the firebase user is not linked with new info", async () => {
    mockFirebaseAuth.setFakeUserInfo(firebaseId, {});
    await request(app)
      .post("/api/v1/actions")
      .set("Authorization", "Bearer dev-action-secret")
      .send(upgradeUserRequest(user.id))
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);
  });
});

function upgradeUserRequest(userId: string): HasuraAction<"upgrade_current_user", Record<string, string>> {
  return {
    action: {
      name: "upgrade_current_user",
    },
    input: {},
    session_variables: {
      "x-hasura-user-id": userId,
    },
  };
}
