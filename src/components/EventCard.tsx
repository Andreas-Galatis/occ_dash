import React from 'react';
import { Music, Users, UserPlus, Star } from 'lucide-react';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
}

const iconMap = {
  Music: Music,
  Users: Users,
  UserPlus: UserPlus,
  Star: Star,
};

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const IconComponent = iconMap[event.icon as keyof typeof iconMap] || Star;

  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${event.iconBg}`}>
          <IconComponent className={`${event.iconColor}`} size={24} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.date}</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {event.attendance} Attendees
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{event.description}</p>
          <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">New Visitors</p>
              <p className="font-medium">{event.stats.newVisitors}</p>
            </div>
            <div>
              <p className="text-gray-500">Volunteers</p>
              <p className="font-medium">{event.stats.volunteers}</p>
            </div>
            <div>
              <p className="text-gray-500">Engagement</p>
              <p className="font-medium">{event.stats.engagement}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};