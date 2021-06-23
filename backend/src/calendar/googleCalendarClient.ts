import { google, calendar_v3 } from "googleapis";
import { assert, assertGet } from "~shared/assert";
import logger from "~shared/logger";
import { InternalServerError } from "../errors";
import { GoogleCalendarEvent } from "~shared/types/googleCalendar";
import { Account } from "~db";

const clientId = assertGet(process.env.GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID is required");
const clientSecret = assertGet(process.env.GOOGLE_CLIENT_SECRET, "GOOGLE_CLIENT_SECRET is required");

function convertGoogleDate(googleDate?: calendar_v3.Schema$EventDateTime): Date | undefined {
  if (!googleDate) return;

  if (googleDate.dateTime) {
    /**
     * Always includes timezone for single events so is safe to use with new Date(). More info:
     * https://googleapis.dev/nodejs/googleapis/latest/calendar/interfaces/Schema$EventDateTime.html#dateTime
     */
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

function extractParticipantEmailsFromGoogleCalendarEvent(event: calendar_v3.Schema$Event): string[] {
  if (event.attendees === undefined) {
    return event.creator?.email ? [event.creator?.email] : [];
  }

  return (event.attendees as { email: string }[]).map((attendee) => attendee.email);
}

/**
 * This function extracts only the relevant fields from the fetched Google Calendar Event
 */
function extractInfoFromGoogleCalendarEvent(event: calendar_v3.Schema$Event): GoogleCalendarEvent {
  return {
    title: event.summary ?? undefined,
    participantEmails: extractParticipantEmailsFromGoogleCalendarEvent(event),
    startTime: convertGoogleDate(event.start),
    endTime: convertGoogleDate(event.end),
    id: event.id ?? undefined,
    authorEmail: event.organizer?.email,
    authorName: event.organizer?.displayName,
    description: event.description ?? undefined,
    videoCallLink: extractVideoCallLink(event),
  };
}

function getAuthorizedGoogleCalendarApi(userAccount: Account) {
  const oauth = new google.auth.OAuth2(clientId, clientSecret);

  assert(
    userAccount.access_token && userAccount.refresh_token,
    "Both access token and refresh token are required to fetch Google Calendar events."
  );

  oauth.setCredentials({
    access_token: userAccount.access_token,
    // refresh_token:
    //   "1//0cOx8bcQ7AajACgYIARAAGAwSNwF-L9IrigqRpCd8j6SwGQsw9Ggg3-2p3N-6r3wQJYGMJpvBdq3HjbuFdk7i7rU9fhCq6U79FGY",
    refresh_token: userAccount.refresh_token,
  });

  const calendarApi = google.calendar({ version: "v3", auth: oauth });

  return calendarApi;
}

export async function fetchCalendarEventsInRangeInCalendar(
  userAccount: Account,
  calendarId: string,
  eventsStartDate: Date,
  eventsEndDate: Date
) {
  const calendarApi = getAuthorizedGoogleCalendarApi(userAccount);

  try {
    const calendarEvents = await calendarApi.events.list({
      calendarId,
      timeMin: eventsStartDate.toISOString(),
      timeMax: eventsEndDate.toISOString(),
      showDeleted: false,

      singleEvents: true, // fetches individual recurring events, ignores parent event
      orderBy: "startTime",
    });

    if (calendarEvents.data.items === undefined) {
      throw new InternalServerError("Failed to fetch events");
    }

    const events = calendarEvents.data.items.map(extractInfoFromGoogleCalendarEvent);

    return events;
  } catch (e) {
    console.log("here error", e);
    logger.info("Google Calendar API request failed");
    throw new InternalServerError("Google Calendar API request failed");
  }
}

export async function fetchCalendarEventsInRange(userAccount: Account, eventsStartDate: Date, eventsEndDate: Date) {
  const calendarApi = getAuthorizedGoogleCalendarApi(userAccount);

  const allCalendars = await calendarApi.calendarList.list();

  console.log("allCalendars", allCalendars.data.items);

  if (!allCalendars.data.items) {
    return [];
  }

  try {
    const eventsFromCalendars = await Promise.all(
      allCalendars.data.items.map(async (singleCalendar) => {
        if (!singleCalendar.id) return [];
        return fetchCalendarEventsInRangeInCalendar(userAccount, singleCalendar.id, eventsStartDate, eventsEndDate);
      })
    );

    const flatListOfAllCalendarEvents = eventsFromCalendars.flat();

    return flatListOfAllCalendarEvents;
  } catch (e) {
    console.log("here error", e);
    logger.info("Google Calendar API request failed");
    throw new InternalServerError("Google Calendar API request failed");
  }
}
