import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarEvent, NewCalendarEvent } from '../types/calendar';

interface EventFormProps {
  start: Date;
  end: Date;
  onSubmit: (event: NewCalendarEvent) => void;
  onCancel: () => void;
  event?: CalendarEvent;
}

export default function EventForm({ start, end, onSubmit, onCancel, event }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    location: event?.location || '',
    description: event?.description || '',
    attendees: event?.attendees || [],
    attendeeInput: '',
    start: format(start, "yyyy-MM-dd'T'HH:mm"),
    end: format(end, "yyyy-MM-dd'T'HH:mm")
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      location: formData.location || null,
      description: formData.description || null,
      attendees: formData.attendees,
      start: new Date(formData.start).toISOString(),
      end: new Date(formData.end).toISOString()
    });
  };

  const handleAddAttendee = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && formData.attendeeInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, prev.attendeeInput.trim()],
        attendeeInput: ''
      }));
    }
  };

  const handleRemoveAttendee = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-pink-500">
          {event ? 'Edit Event' : 'New Event'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-pink-400">Title</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-pink-200 shadow-sm focus:border-pink-300 focus:ring-pink-300 text-pink-500"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-400">Location</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-pink-200 shadow-sm focus:border-pink-300 focus:ring-pink-300 text-pink-500"
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-400">Description</label>
            <textarea
              className="mt-1 block w-full rounded-md border-pink-200 shadow-sm focus:border-pink-300 focus:ring-pink-300 text-pink-500"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-400">Attendees</label>
            <div className="mt-1 space-y-2">
              <input
                type="text"
                placeholder="Press Enter to add attendee"
                className="block w-full rounded-md border-pink-200 shadow-sm focus:border-pink-300 focus:ring-pink-300 text-pink-500"
                value={formData.attendeeInput}
                onChange={e => setFormData(prev => ({ ...prev, attendeeInput: e.target.value }))}
                onKeyDown={handleAddAttendee}
              />
              {formData.attendees.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.attendees.map((attendee, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-pink-100 text-pink-500"
                    >
                      {attendee}
                      <button
                        type="button"
                        onClick={() => handleRemoveAttendee(index)}
                        className="ml-1 text-pink-400 hover:text-pink-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-400">Start Time</label>
            <input
              type="datetime-local"
              required
              className="mt-1 block w-full rounded-md border-pink-200 shadow-sm focus:border-pink-300 focus:ring-pink-300 text-pink-500"
              value={formData.start}
              onChange={e => setFormData(prev => ({ ...prev, start: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-400">End Time</label>
            <input
              type="datetime-local"
              required
              className="mt-1 block w-full rounded-md border-pink-200 shadow-sm focus:border-pink-300 focus:ring-pink-300 text-pink-500"
              value={formData.end}
              onChange={e => setFormData(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-pink-200 rounded-md text-sm font-medium text-pink-500 hover:bg-pink-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-400 hover:bg-pink-500"
            >
              {event ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 