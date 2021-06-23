import { createBackendRequestSender } from "./create";
import { GoogleCalendarEventsAPIRequestBody, GoogleCalendarEvent } from "~shared/types/googleCalendar";

export const googleCalendarEventsApi = createBackendRequestSender<
  GoogleCalendarEventsAPIRequestBody,
  GoogleCalendarEvent[]
>("/v1/google-calendar/events");
