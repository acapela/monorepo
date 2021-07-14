import { addDays } from "date-fns";
import { Router } from "express";
import { db } from "~db";
import { assert } from "~shared/assert";
import { GoogleCalendarEvent, GoogleCalendarEventsAPIRequestBody } from "~shared/types/googleCalendar";
import { createAuthorizedEndpointHandler } from "../endpoints/createEndpointHandler";
import { AuthenticationError } from "../errors/errorTypes";
import { fetchSingleCalendarEventsInRange } from "./googleCalendarClient";
import { tryParseStringDate } from "~shared/dates/parseJSONWithDates";

const TWO_WEEKS_IN_DAYS = 14;

export const router = Router();
/**
 * This endpoint handles handles requests from the client and fetches events from Google Calendar
 */
router.post(
  "/v1/google-calendar/events",
  createAuthorizedEndpointHandler<GoogleCalendarEventsAPIRequestBody, GoogleCalendarEvent[]>(async (input) => {
    assert(input.user.id, "User id is required to fetch google calendar events");

    const userGoogleAccount = await db.account.findFirst({ where: { user_id: input.user.id, provider_id: "google" } });

    const startDate = tryParseStringDate(input.eventsStartDate) || new Date();
    const endDate = tryParseStringDate(input.eventsEndDate) || addDays(startDate, TWO_WEEKS_IN_DAYS);

    assert(
      userGoogleAccount,
      new AuthenticationError(
        "User has no google account connected. It is not possible to fetch Google Calendar events"
      )
    );

    const calendarEvents = await fetchSingleCalendarEventsInRange(userGoogleAccount, "primary", startDate, endDate);

    if (input.ignoreRejected) {
      return calendarEvents.filter((event) => !event.isInvitationRejected);
    }

    return calendarEvents;
  })
);
