import { Request, Response, Router } from "express";
import { assert } from "~shared/assert";
import logger from "~shared/logger";
import { extractAndAssertBearerToken } from "../authentication";
import { AuthenticationError, BadRequestError } from "../errors";
import { isValidDateString } from "../utils";
import { CalendarAPIRequestBody } from "./googleCalendarClient";

export const router = Router();

/**
 * This endpoint handles handles requests from the client and fetches events from Google Calendar
 */
router.post("/v1/calendar", async (req: Request, res: Response) => {
  const token = extractAndAssertBearerToken(req.get("Authorization") || "");

  if (!token) {
    logger.info("No token provided for the calendar API request");
    throw new AuthenticationError("Calendar events API request made with invalid token");
  }

  assert(process.env.BACKEND_AUTH_TOKEN, "BACKEND_AUTH_TOKEN is required");

  if (token !== process.env.BACKEND_AUTH_TOKEN) {
    logger.info("Incorrect token provided for the calendar API request");
    throw new AuthenticationError("Calendar events API request made with invalid token");
  }

  const requestBody = req.body as CalendarAPIRequestBody;

  assert(requestBody, "Calendar API request body is missing");

  const isEventEndDateValid = requestBody.eventsEndDate === undefined || isValidDateString(requestBody.eventsEndDate);
  const isEventStartDateValid =
    requestBody.eventsStartDate === undefined || isValidDateString(requestBody.eventsStartDate);

  if (!requestBody.oAuthToken || !isEventEndDateValid || !isEventStartDateValid) {
    throw new BadRequestError("Calendar events API request made with invalid body");
  }

  const eventsStartDate = requestBody.eventsStartDate ? new Date(requestBody.eventsStartDate) : new Date();
  let eventsEndDate = new Date();
  if (!requestBody.eventsEndDate) {
    const TWO_WEEKS_IN_DAYS = 14;
    eventsEndDate.setDate(eventsStartDate.getDate() + TWO_WEEKS_IN_DAYS);
  } else {
    eventsEndDate = new Date(requestBody.eventsEndDate);
  }

  res.status(204).end();
});
