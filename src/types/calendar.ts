export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string
  end: string; // ISO string
  description: string | null;
  location: string | null;
  attendees: string[];
  createdAt: string;
  updatedAt: string;
}

export type CalendarEvents = {
  [key: string]: CalendarEvent; // key is the event ID
};

export type NewCalendarEvent = Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>; 