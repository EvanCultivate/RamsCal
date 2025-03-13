import { format } from 'date-fns';
import { CalendarEvent } from '../types/calendar';

interface EventDetailsProps {
  event: CalendarEvent;
  onClose: () => void;
  onDelete: () => void;
}

export default function EventDetails({ event, onClose, onDelete }: EventDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-pink-500">{event.title}</h2>
          <button
            onClick={onClose}
            className="text-pink-400 hover:text-pink-600"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-pink-400">Time</h3>
            <p className="text-gray-600">
              {format(new Date(event.start), 'MMM d, yyyy h:mm a')} - 
              {format(new Date(event.end), 'h:mm a')}
            </p>
          </div>

          {event.location && (
            <div>
              <h3 className="text-sm font-medium text-pink-400">Location</h3>
              <p className="text-gray-600">{event.location}</p>
            </div>
          )}

          {event.description && (
            <div>
              <h3 className="text-sm font-medium text-pink-400">Description</h3>
              <p className="text-gray-600">{event.description}</p>
            </div>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-pink-400">Attendees</h3>
              <ul className="list-disc list-inside text-gray-600">
                {event.attendees.map((attendee, index) => (
                  <li key={index}>{attendee}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onDelete}
            className="px-4 py-2 text-sm text-red-500 hover:text-red-600 border border-red-200 rounded-md hover:bg-red-50"
          >
            Delete Event
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-pink-500 border border-pink-200 rounded-md hover:bg-pink-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 