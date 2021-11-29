import { Request, Response } from "express";

import { UserTokenPayload } from "~shared/jwt";
import { logger } from "~shared/logger";
import { JsonValue } from "~shared/types";

import { extractAndAssertBearerToken } from "../authentication";
import { HttpStatus } from "../http";
import { verifyAndParseUserJWT } from "../jwt/verifyAndParseJWT";

export function createEndpointHandler<Input, Output>(
  handler: (input: JsonValue<Input>, request: Request) => Promise<Output>
) {
  return async function endpointHandler(request: Request, response: Response) {
    try {
      const requestResultData = await handler(request.body, request);
      response.status(HttpStatus.OK).json(requestResultData);
    } catch (error) {
      logger.info("endpointHandler failed with error", error as Record<string, unknown>);
      throw error;
    }
  };
}

interface AuthorizedRequestAdditionalData {
  token: string;
  user: UserTokenPayload;
}

export function createAuthorizedEndpointHandler<Input, Output>(
  handler: (input: JsonValue<Input> & AuthorizedRequestAdditionalData, request: Request) => Promise<Output>
) {
  return createEndpointHandler<Input & AuthorizedRequestAdditionalData, Output>(async (input, request) => {
    const token = extractAndAssertBearerToken(request.get("Authorization") || "");

    const user = verifyAndParseUserJWT(token);

    const inputWithAuthData: JsonValue<Input> & AuthorizedRequestAdditionalData = {
      ...input,
      token,
      user,
    };

    return await handler(inputWithAuthData, request);
  });
}
