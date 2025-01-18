import { Metric, Event, YouTubeMetrics, SocialMetrics, DateRange } from '../types';
import { format, subDays } from 'date-fns';
import { fetchYouTubeData } from './youtube';

// Mock data for metrics
const mockMetrics: Metric[] = [
  {
    title: 'Sunday Service Attendance',
    value: 450,
    change: 12.5,
    trend: [410, 425, 445, 430, 450, 460, 450],
  },
  {
    title: 'Youth & Kids Attendance',
    value: 120,
    change: 8.2,
    trend: [100, 105, 115, 110, 120, 118, 120],
  },
  {
    title: 'New Visitors',
    value: 25,
    change: 15.5,
    trend: [18, 20, 22, 21, 24, 23, 25],
  },
  {
    title: 'New Believers',
    value: 12,
    change: -5.5,
    trend: [15, 14, 13, 14, 12, 13, 12],
  },
];

// Mock data for events
const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Sunday Morning Service',
    date: new Date().toISOString(),
    icon: 'Music',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    attendance: 450,
    description: 'Weekly Sunday morning worship service',
    stats: {
      newVisitors: 15,
      volunteers: 45,
      engagement: 'High',
    },
  },
  {
    id: 2,
    title: 'Youth Night',
    date: subDays(new Date(), 2).toISOString(),
    icon: 'Users',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    attendance: 85,
    description: 'Weekly youth gathering with worship and activities',
    stats: {
      newVisitors: 8,
      volunteers: 12,
      engagement: 'Very High',
    },
  },
  {
    id: 3,
    title: 'Kids Ministry',
    date: subDays(new Date(), 4).toISOString(),
    icon: 'UserPlus',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    attendance: 65,
    description: 'Sunday morning children\'s program',
    stats: {
      newVisitors: 5,
      volunteers: 15,
      engagement: 'Medium',
    },
  },
];

export async function fetchMetrics(_dateRange: DateRange): Promise<Metric[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockMetrics;
}

export async function fetchEvents(_dateRange: DateRange): Promise<Event[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockEvents;
}

export async function fetchYouTubeMetrics(dateRange: DateRange): Promise<YouTubeMetrics> {
  return fetchYouTubeData(dateRange);
}

export async function fetchSocialMetrics(_dateRange: DateRange): Promise<SocialMetrics> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    totalEngagements: 3200,
    engagementData: Array.from({ length: 30 }, (_, i) => ({
      date: format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'),
      engagements: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
    })),
    platforms: [
      {
        name: 'Facebook',
        engagements: 1500,
        change: 12.5,
      },
      {
        name: 'Instagram',
        engagements: 1200,
        change: 18.2,
      },
      {
        name: 'Twitter',
        engagements: 500,
        change: -5.3,
      },
    ],
  };
}