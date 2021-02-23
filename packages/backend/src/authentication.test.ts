import request from "supertest";
import { v4 as uuid } from "uuid";
import "./testSupport/testFirebase";
import firebase from "firebase-admin";

import { createUser, findUserByFirebaseId, User } from "./users/users";
import { setupServer } from "./app";
import { HttpStatus } from "./http";
import { assertHasFirebaseAdminAccess } from "./firebase";

const fakeAuth = firebase.auth() as any;

describe("Users endpoint", () => {
  const app = setupServer();

  it("creates a new user and adds hasura claims to their token", async () => {
    const uid = uuid();
    const token = uuid();
    const email = "heiki@acape.la";
    const name = "Heiki Grenke";
    const avatarUrl = "https://example.com/avatar";
    fakeAuth.setFakeUserClaims(uid, { sub: uid });
    fakeAuth.setFakeUserInfo(uid, {
      uid,
      displayName: name,
      emailVerified: true,
      email,
      photoURL: avatarUrl,
    });
    fakeAuth.addFakeUserToken(uid, token);

    expect(await findUserByFirebaseId(uid)).toBeNull();
    await request(app).post("/api/v1/users/").set("Authorization", `Bearer ${token}`).expect(HttpStatus.OK);
    const user = (await findUserByFirebaseId(uid)) as User;
    expect(user).toEqual(
      expect.objectContaining({
        firebaseId: uid,
        email,
        name,
        avatarUrl,
      })
    );
    expect(user.id).toBeDefined();
    const claims = fakeAuth.getFakeUserClaims(uid);
    expect(claims["https://hasura.io/jwt/claims"]).toEqual({
      "x-hasura-user-id": user.id,
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-default-role": "user",
    });
  });

  it("finds an existing user and adds hasura claims to their token", async () => {
    const uid = uuid();
    const token = uuid();
    const email = "heiki@acape.la";
    const name = "Heiki";
    fakeAuth.setFakeUserClaims(uid, { sub: uid });
    fakeAuth.setFakeUserInfo(uid, {
      uid,
      displayName: name,
      emailVerified: true,
      email,
    });
    fakeAuth.addFakeUserToken(uid, token);
    const user = await createUser({
      email,
      firebaseId: uid,
      name,
    });
    await request(app)
      .post("/api/v1/users/")
      .set("Authorization", `Bearer ${token}`)
      .expect(HttpStatus.OK, JSON.stringify(user));
    const retrievedUser = (await findUserByFirebaseId(uid)) as User;
    expect(retrievedUser).toEqual(user);
    const claims = fakeAuth.getFakeUserClaims(uid);
    expect(claims["https://hasura.io/jwt/claims"]).toEqual({
      "x-hasura-user-id": user.id,
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-default-role": "user",
    });
  });

  it("uses email as default name when name does not exist", async () => {
    const uid = uuid();
    const token = uuid();
    const email = "heiki@acape.la";
    fakeAuth.setFakeUserClaims(uid, { sub: uid });
    fakeAuth.setFakeUserInfo(uid, {
      uid,
      emailVerified: true,
      email,
    });
    fakeAuth.addFakeUserToken(uid, token);

    await request(app).post("/api/v1/users/").set("Authorization", `Bearer ${token}`).expect(HttpStatus.OK);
    const user = (await findUserByFirebaseId(uid)) as User;
    expect(user).toEqual(
      expect.objectContaining({
        firebaseId: uid,
        email,
        name: email,
      })
    );
  });

  it("fails if the user has no record on firebase", async () => {
    const uid = uuid();
    const token = uuid();
    fakeAuth.setFakeUserClaims(uid, { sub: uid });
    fakeAuth.addFakeUserToken(uid, token);

    await request(app)
      .post("/api/v1/users/")
      .set("Authorization", `Bearer ${token}`)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it("can create an anonymous user", async () => {
    const uid = uuid();
    const token = uuid();
    fakeAuth.setFakeUserClaims(uid, { sub: uid });
    fakeAuth.setFakeUserInfo(uid, {
      uid,
    });
    fakeAuth.addFakeUserToken(uid, token);

    await request(app).post("/api/v1/users/").set("Authorization", `Bearer ${token}`).expect(HttpStatus.OK);
    const user = (await findUserByFirebaseId(uid)) as User;
    expect(user).toEqual(
      expect.objectContaining({
        firebaseId: uid,
        email: null,
        name: null,
      })
    );
  });

  it("returns unauthorized when the token is missing", async () => {
    await request(app).post("/api/v1/users/").expect(HttpStatus.UNAUTHORIZED);
  });

  it("returns unauthorized when the token is not a bearer type", async () => {
    await request(app).post("/api/v1/users/").set("Authorization", "Basic faketoken").expect(HttpStatus.UNAUTHORIZED);
  });

  it("returns unauthorized when the token is invalid", async () => {
    await request(app).post("/api/v1/users/").set("Authorization", "Bearer faketoken").expect(HttpStatus.UNAUTHORIZED);
  });
});

describe("firebase admin access", () => {
  it("properly asserts firebase admin access", async () => {
    expect(async () => {
      await assertHasFirebaseAdminAccess();
    }).rejects.toMatchInlineSnapshot(
      `[Error: Unable to connect to firebase admin. Is this code running on Google Cloud env or is GOOGLE_APPLICATION_CREDENTIALS env var present?]`
    );
  });
});
