export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string
  end: string; // ISO string
  location: string;
  attendee: string;
  notes?: string;
}

export type CalendarEvents = {
  [key: string]: CalendarEvent; // key is the event ID
}; 