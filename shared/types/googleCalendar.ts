// This type is used for both backend endpoint and frontend that uses this endpoint
export interface GoogleCalendarEvent {
  title?: string;
  description?: string;
  participantEmails: string[];
  startTime?: Date;
  endTime?: Date;
  id?: string;
  authorEmail?: string;
  authorName?: string;
  videoCallLink?: string;
}

export interface GoogleCalendarEventsAPIRequestBody {
  eventsStartDate?: Date;
  eventsEndDate?: Date;
}
