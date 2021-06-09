import { google, calendar_v3 } from "googleapis";
import { assert } from "~shared/assert";
import logger from "~shared/logger";
import { InternalServerError } from "../errors";

export interface CalendarAPIRequestBody {
  oAuthToken?: string;
  eventsStartDate?: string;
  eventsEndDate?: string;
}

interface CalendarEvent {
  title?: string;
  description?: string;
  participantEmails?: string[];
  startTime?: Date;
  endTime?: Date;
  id?: string;
  authorEmail?: string;
  authorName?: string;
  videoCallLink?: string;
}

function convertGoogleDate(googleDate: calendar_v3.Schema$EventDateTime | undefined): Date | undefined {
  if (!googleDate) return;

  if (googleDate.dateTime) {
    return new Date(googleDate.dateTime);
  }
  if (googleDate.date) {
    return new Date(googleDate.date);
  }
}

function extractVideoCallLink(event: calendar_v3.Schema$Event): string | undefined {
  if (event.hangoutLink) return event.hangoutLink;

  if (event.location && event.location.includes("https://")) {
    return event.location;
  }
  return;
}

/**
 * This function extracts only the relevant fields from the fetched Google Calendar Event
 */
const extractInfoFromGoogleCalendarEvent = (event: calendar_v3.Schema$Event): CalendarEvent => {
  const participantEmails = event.attendees
    ? (event.attendees as { email: string }[]).map((attendee) => attendee.email)
    : event.creator?.email
    ? [event.creator?.email]
    : [];
  return {
    title: event.summary ?? undefined,
    participantEmails,
    startTime: convertGoogleDate(event.start),
    endTime: convertGoogleDate(event.end),
    id: event.id ?? undefined,
    authorEmail: event.organizer?.email,
    authorName: event.organizer?.displayName,
    description: event.description ?? undefined,
    videoCallLink: extractVideoCallLink(event),
  };
};

export async function fetchCalendarEventsInRange(oAuthToken: string, eventsStartDate: Date, eventsEndDate: Date) {
  assert(process.env.CLIENT_ID, "CLIENT_ID is required");
  assert(process.env.CLIENT_SECRET, "CLIENT_SECRET is required");

  const oauth = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

  oauth.setCredentials({
    access_token: oAuthToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth });

  try {
    const calendarEvents = await calendar.events.list({
      calendarId: "primary",
      timeMin: eventsStartDate.toISOString(),
      timeMax: eventsEndDate.toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: "startTime",
    });

    if (calendarEvents.data.items === undefined) {
      throw new InternalServerError("Failed to fetch events");
    }

    const events = calendarEvents.data.items.map(extractInfoFromGoogleCalendarEvent);
    return events;
  } catch (e) {
    logger.info("Google Calendar API request failed");
    throw new InternalServerError("Google Calendar API request failed");
  }
}
