import { Request, Response } from "express";
import { parseDatesInObject } from "~shared/dates/parseJSONWithDates";
import logger from "~shared/logger";
import { UserTokenData } from "~shared/types/jwtAuth";
import { extractAndAssertBearerToken } from "../authentication";
import { HttpStatus } from "../http";
import { verifyAndParseUserJWT } from "../jwt/verifyAndParseJWT";

export function createEndpointHandler<Input, Output>(handler: (input: Input, request: Request) => Promise<Output>) {
  return async function endpointHandler(request: Request, response: Response) {
    const requestInput = parseDatesInObject<Input>(request.body ?? {});

    try {
      const requestResultData = await handler(requestInput, request);
      response.status(HttpStatus.OK).json(requestResultData);
    } catch (error) {
      logger.info("Internal server error", error);
      response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}

interface AuthorizedRequestAdditionalData {
  token: string;
  user: UserTokenData;
}

export function createAuthorizedEndpointHandler<Input, Output>(
  handler: (input: Input & AuthorizedRequestAdditionalData, request: Request) => Promise<Output>
) {
  return createEndpointHandler<Input & AuthorizedRequestAdditionalData, Output>(async (input, request) => {
    const token = extractAndAssertBearerToken(request.get("Authorization") || "");

    const user = verifyAndParseUserJWT(token);

    const inputWithAuthData: Input & AuthorizedRequestAdditionalData = {
      ...input,
      token,
      user,
    };

    return await handler(inputWithAuthData, request);
  });
}
