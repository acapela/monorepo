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
  isInvitationRejected: boolean;
}

export interface GoogleCalendarEventsAPIRequestBody {
  ignoreRejected?: boolean;
  eventsStartDate?: Date;
  eventsEndDate?: Date;
}
