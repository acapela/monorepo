import { addDays } from "date-fns";
import { Router } from "express";
import { db } from "~db";
import { assert } from "~shared/assert";
import { GoogleCalendarEvent, GoogleCalendarEventsAPIRequestBody } from "~shared/types/googleCalendar";
import { createAuthorizedEndpointHandler } from "../endpoints/createEndpointHandler";
import { AuthenticationError } from "../errors/errorTypes";
import { fetchSingleCalendarEventsInRange } from "./googleCalendarClient";

const TWO_WEEKS_IN_DAYS = 14;

export const router = Router();
/**
 * This endpoint handles handles requests from the client and fetches events from Google Calendar
 */
router.post(
  "/v1/google-calendar/events",
  createAuthorizedEndpointHandler<GoogleCalendarEventsAPIRequestBody, GoogleCalendarEvent[]>(
    async ({ user, eventsStartDate = new Date(), eventsEndDate = addDays(eventsStartDate, TWO_WEEKS_IN_DAYS) }) => {
      console.log(user, "yyup");
      const userGoogleAccount = await db.account.findFirst({ where: { user_id: user.id, provider_id: "google" } });

      assert(
        userGoogleAccount,
        new AuthenticationError(
          "User has no google account connected. It is not possible to fetch Google Calendar events"
        )
      );

      const calendarEvents = await fetchSingleCalendarEventsInRange(
        userGoogleAccount,
        "primary",
        eventsStartDate,
        eventsEndDate
      );

      return calendarEvents;
    }
  )
);
