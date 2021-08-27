import { Server } from "http";

import request from "supertest";
import { v4 as uuid } from "uuid";

import { setupServer } from "../app";
import { HttpStatus } from "../http";
import { handlers as fakeHandlers } from "./actionHandlers";
import { HasuraAction } from "./actions";

jest.mock("./actionHandlers", () => ({
  handlers: [
    {
      actionName: "some-action",
      handle: jest.fn((userId: string, { someData }: { someData: string }) =>
        Promise.resolve({ response: "cool", someData, userId })
      ),
    },
    {
      actionName: "some-unused-action",
      handle: jest.fn(() => Promise.resolve({ response: "not cool" })),
    },
    {
      actionName: "an-erroring-action-with-status",
      handle: jest.fn(async () => {
        const error = new Error("error message 1");
        (error as any).status = HttpStatus.NOT_FOUND;
        throw error;
      }),
    },
    {
      actionName: "an-erroring-action-without-status",
      handle: jest.fn(() => Promise.reject(new Error("error message 2"))),
    },
  ],
}));

describe("Hasura action handling", () => {
  let app: Server;

  it("setup server", async () => {
    app = await setupServer();
  });

  it("handles actions that have a handler", async () => {
    const input = { someData: uuid() };
    const userId = uuid();
    const event = hasuraAction("some-action", { userId, input });
    expect(fakeHandlers[0].handle).not.toHaveBeenCalled();
    await request(app)
      .post("/api/v1/actions/")
      .send(event)
      .set("Authorization", "Bearer dev-action-secret")
      .expect(HttpStatus.OK, { response: "cool", someData: input.someData, userId });
    expect(fakeHandlers[0].handle).toHaveBeenCalledWith(userId, input);
  });

  it("transforms errors into the hasura required format when they have a status", async () => {
    await request(app)
      .post("/api/v1/actions/")
      .send(hasuraAction("an-erroring-action-with-status"))
      .set("Authorization", "Bearer dev-action-secret")
      .expect(HttpStatus.NOT_FOUND, { code: "404", message: "error message 1" });
  });

  it("transforms errors into the hasura required format when they lack a status", async () => {
    await request(app)
      .post("/api/v1/actions/")
      .send(hasuraAction("an-erroring-action-without-status"))
      .set("Authorization", "Bearer dev-action-secret")
      .expect(HttpStatus.BAD_REQUEST, { code: "400", message: "error message 2" });
  });

  it("returns 422 when no handler is defined for the action", async () => {
    await request(app)
      .post("/api/v1/actions/")
      .send(hasuraAction("unknown-trigger"))
      .set("Authorization", "Bearer dev-action-secret")
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it("returns no error when no user id provided", async () => {
    await request(app)
      .post("/api/v1/actions/")
      .send(hasuraAction("some-action", { userId: null }))
      .set("Authorization", "Bearer dev-action-secret")
      .expect(HttpStatus.OK);
  });

  it("returns unauthorized when the token is missing", async () => {
    await request(app).post("/api/v1/actions/").send(hasuraAction("some-action")).expect(HttpStatus.UNAUTHORIZED);
  });

  it("returns unauthorized when the token is not a bearer type", async () => {
    await request(app)
      .post("/api/v1/actions/")
      .set("Authorization", "Basic dev-action-secret")
      .send(hasuraAction("some-action"))
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it("returns unauthorized when the token is invalid", async () => {
    await request(app)
      .post("/api/v1/actions/")
      .set("Authorization", "Bearer faketoken")
      .send(hasuraAction("all-handlers"))
      .expect(HttpStatus.UNAUTHORIZED);
  });
});

function hasuraAction(
  actionName: string,
  {
    userId = uuid(),
    input = {},
  }: {
    userId?: string | null;
    input?: unknown | null;
  } = {}
): HasuraAction<string, unknown> {
  return {
    action: {
      name: actionName,
    },
    input,
    session_variables: userId
      ? {
          "x-hasura-user-id": userId,
        }
      : {},
  };
}
