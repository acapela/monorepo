import { calendar_v3, google } from "googleapis";

import { Account } from "~db";
import { assert, assertDefined, assertGetAsync } from "~shared/assert";
import { GoogleCalendarEvent } from "~shared/types/googleCalendar";

import { PublicInternalServerError } from "../errors/errorTypes";

const clientId = assertDefined(process.env.GOOGLE_CLIENT_ID, "GOOGLE_CLIENT_ID is required");
const clientSecret = assertDefined(process.env.GOOGLE_CLIENT_SECRET, "GOOGLE_CLIENT_SECRET is required");

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
  const isInvitationRejected = isGoogleEventDeclinedByRequestingUser(event);
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
    isInvitationRejected,
  };
}

function isGoogleEventDeclinedByRequestingUser(event: calendar_v3.Schema$Event) {
  if (!event.attendees) return false;

  const selfAttendee = event.attendees.find((attendee) => attendee.self === true);

  if (!selfAttendee) return false;

  return selfAttendee.responseStatus === "declined";
}

function getAuthorizedGoogleCalendarApi(userAccount: Account) {
  const oauth = new google.auth.OAuth2(clientId, clientSecret);

  assert(
    userAccount.access_token && userAccount.refresh_token,
    "Both access token and refresh token are required to fetch Google Calendar events."
  );

  oauth.setCredentials({
    access_token: userAccount.access_token,
    refresh_token: userAccount.refresh_token,
  });

  const calendarApi = google.calendar({ version: "v3", auth: oauth });

  return calendarApi;
}

export async function fetchSingleCalendarEventsInRange(
  userAccount: Account,
  calendarId: string,
  eventsStartDate: Date,
  eventsEndDate: Date
) {
  const calendarApi = getAuthorizedGoogleCalendarApi(userAccount);

  const calendarEvents = await assertGetAsync(
    calendarApi.events.list({
      calendarId,
      timeMin: eventsStartDate.toISOString(),
      timeMax: eventsEndDate.toISOString(),
      showDeleted: false,

      singleEvents: true, // fetches individual recurring events, ignores parent event
      orderBy: "startTime",
    }),
    new PublicInternalServerError("Failed to fetch google events")
  );

  assert(calendarEvents.data.items, new PublicInternalServerError("Failed to fetch google events"));

  const events = calendarEvents.data.items.map(extractInfoFromGoogleCalendarEvent);

  return events;
}

export async function fetchCalendarEventsInRange(userAccount: Account, eventsStartDate: Date, eventsEndDate: Date) {
  const calendarApi = getAuthorizedGoogleCalendarApi(userAccount);

  const allCalendars = await assertGetAsync(
    calendarApi.calendarList.list(),
    new PublicInternalServerError("Failed to fetch google calendars list")
  );

  assert(allCalendars.data.items, new PublicInternalServerError("Failed to fetch google calendars list"));

  // fetchCalendarEventsInRangeInCalendar has it's own error handling so we don't have to handle it here.
  const eventsFromCalendars = await Promise.all(
    allCalendars.data.items.map(async (singleCalendar) => {
      if (!singleCalendar.id) return [];
      return fetchSingleCalendarEventsInRange(userAccount, singleCalendar.id, eventsStartDate, eventsEndDate);
    })
  );

  const flatListOfAllCalendarEvents = eventsFromCalendars.flat();

  return flatListOfAllCalendarEvents;
}
