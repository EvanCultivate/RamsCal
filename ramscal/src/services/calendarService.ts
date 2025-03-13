import { CalendarEvent, CalendarEvents } from '../types/calendar';

export const calendarService = {
  getAllEvents: async (): Promise<CalendarEvents> => {
    const response = await fetch('/api/events');
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    const events = await response.json();
    return events;
  },

  addEvent: async (event: CalendarEvent): Promise<boolean> => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
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
        throw new Error('Failed to create event');
      }

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
        throw new Error('Failed to update event');
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
      const response = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
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