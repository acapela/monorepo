import { Server } from "http";
import request from "supertest";
import { setupServer } from "./app";
import { HttpStatus } from "./http";

describe("Application", () => {
  let app: Server;

  it("setup server", async () => {
    app = await setupServer();
  });

  it("has 404s set up correctly", async () => {
    await request(app)
      .post("/a-route-that-probably-does-not-exist")
      .expect((response) => {
        expect(response.status).toEqual(HttpStatus.NOT_FOUND);
        expect(response.body.message).toEqual("Not found");
      });
  });
});
