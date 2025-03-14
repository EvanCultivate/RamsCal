import { CalendarEvent, CalendarEvents, NewCalendarEvent } from '../types/calendar';

const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL 
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : '';

export const calendarService = {
  getAllEvents: async (): Promise<CalendarEvents> => {
    try {
      const response = await fetch(`${BASE_URL}/api/events`);
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const events = await response.json();
      console.log('Events received:', events);
      return events;
    } catch (error) {
      console.error('Error in getAllEvents:', error);
      throw error;
    }
  },

  addEvent: async (event: NewCalendarEvent): Promise<boolean> => {
    try {
      console.log('Attempting to create event:', event);
      const fullEvent: CalendarEvent = {
        ...event,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`${BASE_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullEvent),
      });

      console.log('Create event response:', {
        status: response.status,
        statusText: response.statusText,
      });

      if (response.status === 409) {
        const data = await response.json();
        alert(data.error || 'This time slot overlaps with an existing event');
        return false;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to create event: ${response.status}`);
      }

      const result = await response.json();
      console.log('Created event:', result);
      return true;
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to create event. Please try again.');
      return false;
    }
  },

  updateEvent: async (event: CalendarEvent): Promise<boolean> => {
    try {
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (response.status === 409) {
        const data = await response.json();
        alert(data.error || 'This time slot overlaps with an existing event');
        return false;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to update event: ${response.status} ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
      return false;
    }
  },

  deleteEvent: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${BASE_URL}/api/events?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to delete event: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  },

  getEvent: async (id: string): Promise<CalendarEvent | null> => {
    try {
      const events = await calendarService.getAllEvents();
      return events[id] || null;
    } catch (error) {
      console.error('Error getting event:', error);
      alert('Failed to get event details. Please try again.');
      return null;
    }
  }
}; 