import { subDays } from "date-fns";
import { Router } from "express";
import { db } from "~db";
import { assert } from "~shared/assert";
import { GoogleCalendarEvent, GoogleCalendarEventsAPIRequestBody } from "~shared/types/googleCalendar";
import { createAuthorizedEndpointHandler } from "../endpoints/createEndpointHandler";
import { InternalServerError } from "../errors";
import { fetchCalendarEventsInRange } from "./googleCalendarClient";

assert(process.env.BACKEND_AUTH_TOKEN, "BACKEND_AUTH_TOKEN is required");

const TWO_WEEKS_IN_DAYS = 14;

export const router = Router();
/**
 * This endpoint handles handles requests from the client and fetches events from Google Calendar
 */
router.post(
  "/v1/google-calendar/events",
  createAuthorizedEndpointHandler<GoogleCalendarEventsAPIRequestBody, GoogleCalendarEvent[]>(
    async ({ user, eventsEndDate = new Date(), eventsStartDate = subDays(eventsEndDate, TWO_WEEKS_IN_DAYS) }) => {
      const userGoogleAccount = await db.account.findFirst({ where: { user_id: user.id, provider_id: "google" } });

      console.log("a", { user, userGoogleAccount });

      assert(userGoogleAccount, "User has no google account. It is not possible to fetch Google Calendar events");
      console.log("b", userGoogleAccount);

      console.log("c", { eventsStartDate, eventsEndDate });
      try {
        const calendarEvents = await fetchCalendarEventsInRange(userGoogleAccount, eventsStartDate, eventsEndDate);

        console.log({ calendarEvents });
        return calendarEvents;
      } catch (e) {
        console.log("SUPER ERROR", e);
        throw new InternalServerError("Calendar API request failed");
      }
    }
  )
);
