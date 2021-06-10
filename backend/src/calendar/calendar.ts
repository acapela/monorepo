import { Request, Response, Router } from "express";
import { assertGet } from "~shared/assert";
import logger from "~shared/logger";
import { extractAndAssertBearerToken } from "../authentication";
import { AuthenticationError, BadRequestError } from "../errors";
import { HttpStatus } from "../http";
import { isValidOptionalDateArgument } from "../utils";
import { CalendarAPIRequestBody, fetchCalendarEventsInRange } from "./googleCalendarClient";

const backendAuthToken = assertGet(process.env.BACKEND_AUTH_TOKEN, "BACKEND_AUTH_TOKEN is required");

export const router = Router();

/**
 * This endpoint handles handles requests from the client and fetches events from Google Calendar
 */
router.post("/v1/calendar", async (req: Request, res: Response) => {
  const token = extractAndAssertBearerToken(req.get("Authorization") || "");

  if (token !== backendAuthToken) {
    logger.info("Incorrect token provided for the calendar API request");
    throw new AuthenticationError("Calendar events API request made with invalid token");
  }

  const requestBody = req.body as CalendarAPIRequestBody;

  if (!requestBody) {
    throw new BadRequestError("Calendar API request body is missing");
  }

  const { oAuthToken, eventsEndDate, eventsStartDate } = requestBody;

  if (!oAuthToken || !isValidOptionalDateArgument(eventsEndDate) || !isValidOptionalDateArgument(eventsStartDate)) {
    throw new BadRequestError("Calendar events API request made with invalid body");
  }

  const rangeStartDate = eventsStartDate ? new Date(eventsStartDate) : new Date();
  let rangeEndDate = new Date();
  if (!eventsEndDate) {
    const TWO_WEEKS_IN_DAYS = 14;
    rangeEndDate.setDate(rangeStartDate.getDate() + TWO_WEEKS_IN_DAYS);
  } else {
    rangeEndDate = new Date(eventsEndDate);
  }
  try {
    const calendarEvents = await fetchCalendarEventsInRange(oAuthToken, rangeStartDate, rangeEndDate);
    res.status(HttpStatus.OK).json(calendarEvents);
  } catch (e) {
    logger.info("Calendar API request failed");
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});
