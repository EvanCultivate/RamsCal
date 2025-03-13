import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { CalendarEvent, CalendarEvents } from '@/types/calendar';

const EVENTS_KEY = 'calendar_events';

// Helper function to check for event overlap
function hasOverlap(newEvent: CalendarEvent, existingEvents: CalendarEvents, excludeId?: string): boolean {
  return Object.values(existingEvents).some(existingEvent => {
    if (excludeId && existingEvent.id === excludeId) return false;
    
    const newStart = new Date(newEvent.start);
    const newEnd = new Date(newEvent.end);
    const existingStart = new Date(existingEvent.start);
    const existingEnd = new Date(existingEvent.end);
    
    return (
      (newStart >= existingStart && newStart < existingEnd) ||
      (newEnd > existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    );
  });
}

// GET /api/events
export async function GET() {
  try {
    const events = await kv.get<CalendarEvents>(EVENTS_KEY) || {};
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events
export async function POST(request: Request) {
  try {
    const events = (await kv.get<CalendarEvents>(EVENTS_KEY)) || {};
    const newEvent: CalendarEvent = await request.json();
    
    if (hasOverlap(newEvent, events)) {
      return NextResponse.json(
        { error: 'Event overlaps with an existing event' },
        { status: 409 }
      );
    }

    events[newEvent.id] = newEvent;
    await kv.set(EVENTS_KEY, events);
    return NextResponse.json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

// PUT /api/events
export async function PUT(request: Request) {
  try {
    const events = (await kv.get<CalendarEvents>(EVENTS_KEY)) || {};
    const updatedEvent: CalendarEvent = await request.json();
    
    if (hasOverlap(updatedEvent, events, updatedEvent.id)) {
      return NextResponse.json(
        { error: 'Event overlaps with an existing event' },
        { status: 409 }
      );
    }

    events[updatedEvent.id] = updatedEvent;
    await kv.set(EVENTS_KEY, events);
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE /api/events?id=xxx
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const events = (await kv.get<CalendarEvents>(EVENTS_KEY)) || {};
    delete events[id];
    await kv.set(EVENTS_KEY, events);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
} 