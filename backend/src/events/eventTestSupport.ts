import request from "supertest";
import { v4 as uuid } from "uuid";
import { BaseHasuraEvent } from "../hasura/events";

export function sendEvent(
  app: Express.Application,
  triggerName: string,
  params: HasuraEventParameters = {}
): request.Test {
  return request(app)
    .post("/api/v1/events")
    .set("Authorization", "Bearer dev-event-secret")
    .send(createTestHasuraEvent(triggerName, params));
}

export interface HasuraEventParameters {
  op?: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  oldData?: any;
  newData?: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  userId?: string | null;
}

export function createTestHasuraEvent(
  triggerName: string,
  { op = "INSERT", oldData = null, newData = null, userId = uuid() }: HasuraEventParameters = {}
): BaseHasuraEvent<any, unknown, unknown> {
  return {
    id: uuid(),
    created_at: new Date().toString(),
    trigger: {
      name: triggerName,
    },
    table: {
      schema: "test",
      name: "test",
    },
    event: {
      op,
      session_variables: userId
        ? {
            "x-hasura-user-id": userId,
          }
        : {},
      data: {
        new: newData,
        old: oldData,
      },
    },
  };
}
