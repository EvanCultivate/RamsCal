import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, startOfDay, addHours, addWeeks, subWeeks, endOfWeek } from 'date-fns';
import { CalendarEvent } from '../types/calendar';
import { calendarService } from '../services/calendarService';
import EventForm from './EventForm';
import EventDetails from './EventDetails';
import PasswordProtection from './PasswordProtection';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = Array.from({ length: 7 }, (_, i) => i);

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const authenticated = localStorage.getItem('ramscal_authenticated') === 'true';
    setIsAuthenticated(authenticated);
    if (authenticated) {
      loadEvents();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const storedEvents = await calendarService.getAllEvents();
      setEvents(Object.values(storedEvents));
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotClick = (day: number, hour: number) => {
    const start = addHours(addDays(currentWeek, day), hour);
    const end = addHours(start, 1);
    setSelectedSlot({ start, end });
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
  };

  const handleEventSubmit = async (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: crypto.randomUUID()
    };

    if (await calendarService.addEvent(newEvent)) {
      await loadEvents();
      setSelectedSlot(null);
    }
  };

  const handleEventDelete = async (id: string) => {
    await calendarService.deleteEvent(id);
    await loadEvents();
    setSelectedEvent(null);
  };

  const navigateWeek = (direction: 'prev' | 'next' | 'today') => {
    setCurrentWeek(current => {
      switch (direction) {
        case 'prev':
          return subWeeks(current, 1);
        case 'next':
          return addWeeks(current, 1);
        case 'today':
          return startOfWeek(new Date());
        default:
          return current;
      }
    });
  };

  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticate={() => setIsAuthenticated(true)} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-pink-300">Loading calendar...</div>
      </div>
    );
  }

  const weekStart = format(currentWeek, 'MMM d, yyyy');
  const weekEnd = format(endOfWeek(currentWeek), 'MMM d, yyyy');

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-pink-400">Ramsee&apos;s Calendar</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateWeek('today')}
            className="px-4 py-2 text-sm font-medium text-pink-500 border border-pink-200 rounded-md hover:bg-pink-50"
          >
            Today
          </button>
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 text-pink-500 hover:bg-pink-50 rounded-md"
          >
            ←
          </button>
          <span className="text-pink-500 font-medium">
            {weekStart} - {weekEnd}
          </span>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 text-pink-500 hover:bg-pink-50 rounded-md"
          >
            →
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-8 gap-1">
        {/* Time column */}
        <div className="col-span-1">
          <div className="h-10"></div>
          {HOURS.map(hour => (
            <div key={hour} className="h-20 border-t border-pink-100 flex items-center justify-center text-pink-400">
              {format(addHours(startOfDay(new Date()), hour), 'ha')}
            </div>
          ))}
        </div>

        {/* Days columns */}
        {DAYS.map(day => (
          <div key={day} className="col-span-1">
            <div className="h-10 flex items-center justify-center font-bold text-pink-500">
              {format(addDays(currentWeek, day), 'EEE MM/dd')}
            </div>
            {HOURS.map(hour => (
              <div
                key={`${day}-${hour}`}
                className="h-20 border border-pink-100 cursor-pointer hover:bg-pink-50"
                onClick={() => handleSlotClick(day, hour)}
              >
                {events
                  .filter(event => {
                    const eventStart = new Date(event.start);
                    const slotStart = addHours(addDays(currentWeek, day), hour);
                    const slotEnd = addHours(slotStart, 1);
                    return (
                      eventStart >= slotStart && eventStart < slotEnd
                    );
                  })
                  .map(event => (
                    <div
                      key={event.id}
                      className="bg-pink-300 text-white p-1 text-sm rounded hover:bg-pink-400"
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      <span>{event.title}</span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedSlot && (
        <EventForm
          start={selectedSlot.start}
          end={selectedSlot.end}
          onSubmit={handleEventSubmit}
          onCancel={() => setSelectedSlot(null)}
        />
      )}

      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={() => handleEventDelete(selectedEvent.id)}
        />
      )}
    </div>
  );
} 