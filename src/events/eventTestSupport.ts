import { v4 as uuid } from "uuid";
import request from "supertest";
import { HasuraEventOperation, BaseHasuraEvent } from "./events";

export function sendEvent(
  app: Express.Application,
  triggerName: string,
  params: HasuraEventParameters = {}
): request.Test {
  return request(app)
    .post("/api/v1/events")
    .set("Authorization", "Bearer dev-event-secret")
    .send(hasuraEvent(triggerName, params));
}

export interface HasuraEventParameters {
  op?: HasuraEventOperation;
  oldData?: any;
  newData?: any;
  userId?: string | null;
}

export function hasuraEvent(
  triggerName: string,
  { op = HasuraEventOperation.INSERT, oldData = null, newData = null, userId = uuid() }: HasuraEventParameters = {}
): BaseHasuraEvent<typeof op, unknown, unknown> {
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
