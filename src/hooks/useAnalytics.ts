import { useState, useEffect } from 'react';
import { DateRange, Metric, YouTubeMetrics, SocialMetrics, Event } from '../types';
import { 
  fetchMetrics, 
  fetchYouTubeMetrics, 
  fetchSocialMetrics,
  fetchEvents 
} from '../lib/api';

export function useAnalytics(dateRange: DateRange) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [youtubeMetrics, setYoutubeMetrics] = useState<YouTubeMetrics | null>(null);
  const [socialMetrics, setSocialMetrics] = useState<SocialMetrics | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [metricsData, youtubeData, socialData, eventsData] = await Promise.all([
          fetchMetrics(dateRange),
          fetchYouTubeMetrics(dateRange),
          fetchSocialMetrics(dateRange),
          fetchEvents(dateRange),
        ]);

        setMetrics(metricsData);
        setYoutubeMetrics(youtubeData);
        setSocialMetrics(socialData);
        setEvents(eventsData);
      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  return {
    metrics,
    youtubeMetrics,
    socialMetrics,
    events,
    loading,
    error,
  };
}