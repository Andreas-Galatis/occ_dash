import React from 'react';
import { Event } from '../types';
import { EventCard } from './EventCard';
import { Modal } from './Modal';
import { Calendar, Filter } from 'lucide-react';

interface EventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
}

export const EventsModal: React.FC<EventsModalProps> = ({ isOpen, onClose, events }) => {
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());
  const pastEvents = events.filter(event => new Date(event.date) < new Date());

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Church Events">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="date"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} />
              <span>Filter</span>
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">Past Events</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Upcoming Events
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-gray-500 text-center py-4">No upcoming events scheduled</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Past Events</h3>
            <div className="space-y-4">
              {pastEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
              {pastEvents.length === 0 && (
                <p className="text-gray-500 text-center py-4">No past events to display</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};