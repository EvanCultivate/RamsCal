import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarEvent } from '../types/calendar';

interface EventFormProps {
  start: Date;
  end: Date;
  onSubmit: (event: Omit<CalendarEvent, 'id'>) => void;
  onCancel: () => void;
  event?: CalendarEvent;
}

export default function EventForm({ start, end, onSubmit, onCancel, event }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    location: event?.location || '',
    attendee: event?.attendee || '',
    notes: event?.notes || '',
    start: format(start, "yyyy-MM-dd'T'HH:mm"),
    end: format(end, "yyyy-MM-dd'T'HH:mm")
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      location: formData.location,
      attendee: formData.attendee,
      notes: formData.notes,
      start: new Date(formData.start).toISOString(),
      end: new Date(formData.end).toISOString()
    });
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
              required
              className="mt-1 block w-full rounded-md border-pink-200 shadow-sm focus:border-pink-300 focus:ring-pink-300 text-pink-500"
              value={formData.location}
              onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pink-400">Attendee</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-pink-200 shadow-sm focus:border-pink-300 focus:ring-pink-300 text-pink-500"
              value={formData.attendee}
              onChange={e => setFormData(prev => ({ ...prev, attendee: e.target.value }))}
            />
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

          <div>
            <label className="block text-sm font-medium text-pink-400">Notes</label>
            <textarea
              className="mt-1 block w-full rounded-md border-pink-200 shadow-sm focus:border-pink-300 focus:ring-pink-300 text-pink-500"
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
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