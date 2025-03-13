import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CalendarEvent } from '@/types/calendar';

// Create a single PrismaClient instance and reuse it
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper function to check for event overlap
async function hasOverlap(newEvent: CalendarEvent, excludeId?: string): Promise<boolean> {
  const overlappingEvent = await prisma.calendarEvent.findFirst({
    where: {
      AND: [
        {
          OR: [
            {
              AND: [
                { start: { lte: new Date(newEvent.start) } },
                { end: { gt: new Date(newEvent.start) } }
              ]
            },
            {
              AND: [
                { start: { lt: new Date(newEvent.end) } },
                { end: { gte: new Date(newEvent.end) } }
              ]
            }
          ]
        },
        {
          id: { not: excludeId }
        }
      ]
    }
  });
  
  return !!overlappingEvent;
}

// GET /api/events
export async function GET() {
  console.log('GET /api/events - Starting request');
  try {
    console.log('Attempting to connect to database...');
    const events = await prisma.calendarEvent.findMany();
    console.log(`Successfully fetched ${events.length} events`);
    
    // Convert to the expected format
    const eventsMap = events.reduce((acc, event) => {
      acc[event.id] = {
        ...event,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
      };
      return acc;
    }, {} as Record<string, CalendarEvent>);
    
    return NextResponse.json(eventsMap);
  } catch (error) {
    console.error('Error in GET /api/events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/events
export async function POST(request: Request) {
  console.log('POST /api/events - Starting request');
  try {
    const newEvent: CalendarEvent = await request.json();
    console.log('Received event data:', newEvent);
    
    // Validate required fields
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields', details: 'Title, start, and end are required' },
        { status: 400 }
      );
    }

    // Check for overlap
    console.log('Checking for event overlap...');
    if (await hasOverlap(newEvent)) {
      console.log('Event overlap detected');
      return NextResponse.json(
        { error: 'Event overlaps with an existing event' },
        { status: 409 }
      );
    }

    console.log('Creating event in database...');
    const createdEvent = await prisma.calendarEvent.create({
      data: {
        title: newEvent.title,
        start: new Date(newEvent.start),
        end: new Date(newEvent.end),
        description: newEvent.description || null,
        location: newEvent.location || null,
        attendees: newEvent.attendees || []
      }
    });
    console.log('Event created successfully:', createdEvent);

    const formattedEvent = {
      ...createdEvent,
      start: createdEvent.start.toISOString(),
      end: createdEvent.end.toISOString(),
      createdAt: createdEvent.createdAt.toISOString(),
      updatedAt: createdEvent.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedEvent);
  } catch (error) {
    console.error('Error in POST /api/events:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create event', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}

// PUT /api/events
export async function PUT(request: Request) {
  try {
    const updatedEvent: CalendarEvent = await request.json();
    
    if (await hasOverlap(updatedEvent, updatedEvent.id)) {
      return NextResponse.json(
        { error: 'Event overlaps with an existing event' },
        { status: 409 }
      );
    }

    const event = await prisma.calendarEvent.update({
      where: { id: updatedEvent.id },
      data: {
        ...updatedEvent,
        start: new Date(updatedEvent.start),
        end: new Date(updatedEvent.end),
        attendees: updatedEvent.attendees || []
      }
    });

    return NextResponse.json({
      ...event,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
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

    await prisma.calendarEvent.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 