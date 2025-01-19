import { Metric, Event, YouTubeMetrics, SocialMetrics, DateRange } from '../types';
import { fetchYouTubeData } from './youtube';
import { fetchAttendanceData, AttendanceRecord } from './supabase';
import { format, subDays } from 'date-fns';

export async function fetchMetrics(dateRange: DateRange): Promise<Metric[]> {
  try {
    const attendanceData = await fetchAttendanceData(dateRange.start, dateRange.end);
    
    if (!attendanceData || attendanceData.length === 0) {
      return [
        {
          title: 'Total Attendance',
          value: 0,
          change: 0,
          trend: [],
        },
        {
          title: 'Adult Attendance',
          value: 0,
          change: 0,
          trend: [],
        },
        {
          title: 'Youth Attendance',
          value: 0,
          change: 0,
          trend: [],
        },
        {
          title: 'Kids Attendance',
          value: 0,
          change: 0,
          trend: [],
        },
      ];
    }

    // Sort data chronologically
    const sortedData = [...attendanceData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate averages for the current period
    const calculateAverage = (values: number[]) => {
      const validValues = values.filter(v => v !== null && !isNaN(v));
      return validValues.length > 0 
        ? validValues.reduce((sum, val) => sum + val, 0) / validValues.length 
        : 0;
    };

    // Calculate current period averages
    const currentAverages = {
      total: calculateAverage(sortedData.map(record => record.Total || 0)),
      adult: calculateAverage(sortedData.map(record => record.Adult || 0)),
      youth: calculateAverage(sortedData.map(record => record.Oyth || 0)),
      kids: calculateAverage(sortedData.map(record => record.Okids || 0)),
    };

    // Calculate previous period averages
    const periodLength = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const previousStart = new Date(dateRange.start.getTime() - periodLength * 24 * 60 * 60 * 1000);
    const previousEnd = new Date(dateRange.start.getTime() - 1);

    const previousData = await fetchAttendanceData(previousStart, previousEnd);
    const previousAverages = {
      total: calculateAverage(previousData.map(record => record.Total || 0)),
      adult: calculateAverage(previousData.map(record => record.Adult || 0)),
      youth: calculateAverage(previousData.map(record => record.Oyth || 0)),
      kids: calculateAverage(previousData.map(record => record.Okids || 0)),
    };

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return 0;
      return ((current - previous) / previous) * 100;
    };

    // Create trend data
    const trend = sortedData.map(record => ({
      date: record.date,
      total: record.Total || 0,
      adults: record.Adult || 0,
      youth: record.Oyth || 0,
      kids: record.Okids || 0,
    }));

    return [
      {
        title: 'Total Attendance',
        value: Math.round(currentAverages.total),
        change: calculateChange(currentAverages.total, previousAverages.total),
        trend,
      },
      {
        title: 'Adult Attendance',
        value: Math.round(currentAverages.adult),
        change: calculateChange(currentAverages.adult, previousAverages.adult),
        trend,
      },
      {
        title: 'Youth Attendance',
        value: Math.round(currentAverages.youth),
        change: calculateChange(currentAverages.youth, previousAverages.youth),
        trend,
      },
      {
        title: 'Kids Attendance',
        value: Math.round(currentAverages.kids),
        change: calculateChange(currentAverages.kids, previousAverages.kids),
        trend,
      },
    ];
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
}

export async function fetchYouTubeMetrics(dateRange: DateRange): Promise<YouTubeMetrics> {
  try {
    return await fetchYouTubeData(dateRange);
  } catch (error) {
    console.error('Error fetching YouTube metrics:', error);
    // Return default structure with zero values
    return {
      totalViews: 0,
      viewsData: [],
      videos: [],
      watchTime: 0,
      subscribers: 0,
      subscriberChange: 0,
    };
  }
}

export async function fetchSocialMetrics(dateRange: DateRange): Promise<SocialMetrics> {
  try {
    // This is a mock implementation - replace with actual social media API calls
    const daysDiff = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Generate mock engagement data for the date range
    const engagementData = Array.from({ length: daysDiff }, (_, i) => ({
      date: format(subDays(dateRange.end, daysDiff - 1 - i), 'yyyy-MM-dd'),
      engagements: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
    }));

    const totalEngagements = engagementData.reduce((sum, day) => sum + day.engagements, 0);

    return {
      totalEngagements,
      engagementData,
      platforms: [
        {
          name: 'Facebook',
          engagements: Math.round(totalEngagements * 0.45), // 45% of total
          change: 12.5,
        },
        {
          name: 'Instagram',
          engagements: Math.round(totalEngagements * 0.35), // 35% of total
          change: 18.2,
        },
        {
          name: 'Twitter',
          engagements: Math.round(totalEngagements * 0.20), // 20% of total
          change: -5.3,
        },
      ],
    };
  } catch (error) {
    console.error('Error fetching social metrics:', error);
    return {
      totalEngagements: 0,
      engagementData: [],
      platforms: [],
    };
  }
}

export async function fetchEvents(dateRange: DateRange): Promise<Event[]> {
  try {
    // This is a mock implementation - replace with actual events API calls
    const mockEvents: Event[] = [
      {
        id: 1,
        title: 'Sunday Morning Service',
        date: dateRange.end.toISOString(),
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
        date: subDays(dateRange.end, 2).toISOString(),
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
        date: subDays(dateRange.end, 4).toISOString(),
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

    return mockEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= dateRange.start && eventDate <= dateRange.end;
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}