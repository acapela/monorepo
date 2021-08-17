import { GoogleCalendarEvent, GoogleCalendarEventsAPIRequestBody } from "~shared/types/googleCalendar";

import { createBackendRequestSender } from "./create";

export const googleCalendarEventsApi = createBackendRequestSender<
  GoogleCalendarEventsAPIRequestBody,
  GoogleCalendarEvent[]
>("/v1/google-calendar/events");
