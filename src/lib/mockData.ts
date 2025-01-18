import { Metric, Event, YouTubeMetrics, SocialMetrics, DateRange } from '../types';
import { format, subDays } from 'date-fns';

export function generateMockMetrics(): Metric[] {
  return [
    {
      title: 'Sunday Service Attendance',
      value: 450,
      change: 12.5,
      trend: generateTrendData(7, 380, 500),
    },
    {
      title: 'Youth & Kids Attendance',
      value: 120,
      change: 8.3,
      trend: generateTrendData(7, 100, 150),
    },
    {
      title: 'New Visitors',
      value: 25,
      change: 15.2,
      trend: generateTrendData(7, 15, 30),
    },
    {
      title: 'New Believers',
      value: 12,
      change: -5.5,
      trend: generateTrendData(7, 10, 20),
    },
  ];
}

export function generateMockEvents(): Event[] {
  return [
    {
      id: 1,
      title: 'Sunday Morning Service',
      date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
      icon: 'Music',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      attendance: 450,
      description: 'Weekly worship service with Pastor John',
      stats: {
        newVisitors: 15,
        volunteers: 45,
        engagement: 'High',
      },
    },
    {
      id: 2,
      title: 'Youth Night',
      date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
      icon: 'Users',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      attendance: 85,
      description: 'Weekly youth gathering with games and worship',
      stats: {
        newVisitors: 8,
        volunteers: 12,
        engagement: 'Very High',
      },
    },
    {
      id: 3,
      title: 'Kids Ministry',
      date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
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
}

export function generateMockYouTubeMetrics(): YouTubeMetrics {
  return {
    totalViews: 24500,
    viewsData: generateDailyData(30, 500, 1200),
    videos: [
      {
        title: 'Sunday Service - Latest',
        views: 1200,
        likes: 145,
        avgWatchTime: '15:30',
      },
      {
        title: 'Worship Night Highlights',
        views: 850,
        likes: 95,
        avgWatchTime: '8:45',
      },
      {
        title: 'Pastor\'s Weekly Message',
        views: 750,
        likes: 88,
        avgWatchTime: '12:20',
      },
    ],
  };
}

export function generateMockSocialMetrics(): SocialMetrics {
  return {
    totalEngagements: 3200,
    engagementData: generateDailyData(30, 50, 200),
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

function generateTrendData(days: number, min: number, max: number): number[] {
  return Array.from({ length: days }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}

function generateDailyData(days: number, min: number, max: number) {
  return Array.from({ length: days }, (_, i) => ({
    date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
    views: Math.floor(Math.random() * (max - min + 1)) + min,
  })).reverse();
}