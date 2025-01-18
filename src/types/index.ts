export interface Metric {
  title: string;
  value: number;
  change: number;
  trend: number[];
  icon?: any;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  attendance: number;
  description: string;
  stats: {
    newVisitors: number;
    volunteers: number;
    engagement: string;
  };
}

export interface YouTubeMetrics {
  totalViews: number;
  viewsData: {
    date: string;
    views: number;
    estimatedMinutesWatched: number;
    averageViewDuration: number;
    averageViewPercentage: number;
    subscribersGained: number;
    subscribersLost: number;
    likes: number;
    dislikes: number;
    shares: number;
    comments: number;
  }[];
  videos: {
    title: string;
    views: number;
    likes: number;
    avgWatchTime: string;
  }[];
  watchTime: number;
  subscribers: number;
  subscriberChange: number;
  viewsChange: number;
  engagement: {
    likes: number;
    dislikes: number;
    shares: number;
    comments: number;
    averageViewPercentage: number;
  };
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface SocialMetrics {
  totalEngagements: number;
  engagementData: {
    date: string;
    engagements: number;
  }[];
  platforms: {
    name: string;
    engagements: number;
    change: number;
  }[];
}