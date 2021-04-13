import { Server } from "http";
import request from "supertest";
import { v4 as uuid } from "uuid";
import { setupServer } from "../app";
import { HttpStatus } from "../http";
import { handlers as fakeHandlers } from "./eventHandlers";
import { HasuraEventOperation } from "./events";
import { hasuraEvent } from "./eventTestSupport";

jest.mock("./eventHandlers", () => ({
  handlers: [
    {
      triggerName: "no-handlers",
    },
    {
      triggerName: "all-handlers",
      handleInsert: jest.fn(),
      handleUpdate: jest.fn(),
      handleDelete: jest.fn(),
      handleManual: jest.fn(),
    },
  ],
}));

describe("Hasura event handling", () => {
  let app: Server;

  it("setup server", async () => {
    app = await setupServer();
  });

  it("handles insert events", async () => {
    const newData = { someData: uuid() };
    const userId = uuid();
    const event = hasuraEvent("all-handlers", { op: HasuraEventOperation.INSERT, oldData: null, newData, userId });
    expect(fakeHandlers[1].handleInsert).not.toHaveBeenCalled();
    await request(app)
      .post("/api/v1/events/")
      .send(event)
      .set("Authorization", "Bearer dev-event-secret")
      .expect(HttpStatus.OK);
    expect(fakeHandlers[1].handleInsert).toHaveBeenCalledWith(userId, newData);
  });

  it("handles update events", async () => {
    const oldData = { someData: uuid() };
    const newData = { someData: uuid() };
    const userId = uuid();
    const event = hasuraEvent("all-handlers", { op: HasuraEventOperation.UPDATE, oldData, newData, userId });
    expect(fakeHandlers[1].handleUpdate).not.toHaveBeenCalled();
    await request(app)
      .post("/api/v1/events/")
      .send(event)
      .set("Authorization", "Bearer dev-event-secret")
      .expect(HttpStatus.OK);
    expect(fakeHandlers[1].handleUpdate).toHaveBeenCalledWith(userId, oldData, newData);
  });

  it("handles delete events", async () => {
    const oldData = { someData: uuid() };
    const userId = uuid();
    const event = hasuraEvent("all-handlers", { op: HasuraEventOperation.DELETE, oldData, newData: null, userId });
    expect(fakeHandlers[1].handleDelete).not.toHaveBeenCalled();
    await request(app)
      .post("/api/v1/events/")
      .send(event)
      .set("Authorization", "Bearer dev-event-secret")
      .expect(HttpStatus.OK);
    expect(fakeHandlers[1].handleDelete).toHaveBeenCalledWith(userId, oldData);
  });

  it("handles manual events", async () => {
    const newData = { someData: uuid() };
    const userId = uuid();
    const event = hasuraEvent("all-handlers", { op: HasuraEventOperation.MANUAL, oldData: null, newData, userId });
    expect(fakeHandlers[1].handleManual).not.toHaveBeenCalled();
    await request(app)
      .post("/api/v1/events/")
      .send(event)
      .set("Authorization", "Bearer dev-event-secret")
      .expect(HttpStatus.OK);
    expect(fakeHandlers[1].handleManual).toHaveBeenCalledWith(userId, newData);
  });

  it("returns 422 when no handler is defined for the trigger", async () => {
    await request(app)
      .post("/api/v1/events/")
      .send(hasuraEvent("unknown-event"))
      .set("Authorization", "Bearer dev-event-secret")
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it("returns 422 when no handler is defined for the operation", async () => {
    await request(app)
      .post("/api/v1/events/")
      .send(hasuraEvent("no-handlers"))
      .set("Authorization", "Bearer dev-event-secret")
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it("returns unauthorized when no user id provided", async () => {
    await request(app)
      .post("/api/v1/events/")
      .send(hasuraEvent("all-handlers", { userId: null }))
      .set("Authorization", "Bearer dev-event-secret")
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it("returns unauthorized when the token is missing", async () => {
    await request(app).post("/api/v1/events/").send(hasuraEvent("all-handlers")).expect(HttpStatus.UNAUTHORIZED);
  });

  it("returns unauthorized when the token is not a bearer type", async () => {
    await request(app)
      .post("/api/v1/events/")
      .set("Authorization", "Basic dev-event-secret")
      .send(hasuraEvent("all-handlers"))
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it("returns unauthorized when the token is invalid", async () => {
    await request(app)
      .post("/api/v1/events/")
      .set("Authorization", "Bearer faketoken")
      .send(hasuraEvent("all-handlers"))
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
