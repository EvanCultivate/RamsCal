addEvent: async (event: CalendarEvent): Promise<boolean> => {
  try {
    console.log('Attempting to create event with full details:', {
      ...event,
      attendeesLength: event.attendees?.length,
      attendeesContent: event.attendees
    });
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
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
      throw new Error(`Failed to create event: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Created event with result:', result);
    return true;
  } catch (error) {
    console.error('Error adding event:', error);
    alert('Failed to create event. Please try again.');
    return false;
  }
}, 