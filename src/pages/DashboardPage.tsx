import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MetricCard } from '../components/MetricCard';
import { DateRangePicker } from '../components/DateRangePicker';
import { YouTubeSection } from '../components/YouTubeSection';
import { SocialSection } from '../components/SocialSection';
import { EventCard } from '../components/EventCard';
import { EventsModal } from '../components/EventsModal';
import { useAnalytics } from '../hooks/useAnalytics';
import { DateRange } from '../types';
import { subDays } from 'date-fns';

export function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [dateRange, setDateRange] = React.useState<DateRange>({
    start: subDays(new Date(), 30),
    end: new Date(),
  });
  const [showEventsModal, setShowEventsModal] = React.useState(false);

  const {
    metrics,
    youtubeMetrics,
    socialMetrics,
    events,
    loading,
    error
  } = useAnalytics(dateRange);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Church Analytics Dashboard</h1>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric) => (
                <MetricCard
                  key={metric.title}
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  trend={metric.trend}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {youtubeMetrics && <YouTubeSection data={youtubeMetrics} />}
              {socialMetrics && <SocialSection data={socialMetrics} />}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Events</h2>
                <button 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => setShowEventsModal(true)}
                >
                  View All Events
                </button>
              </div>
              <div className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <EventsModal
        isOpen={showEventsModal}
        onClose={() => setShowEventsModal(false)}
        events={events}
      />
    </div>
  );
}