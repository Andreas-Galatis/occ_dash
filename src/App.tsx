import React, { useState } from 'react';
import { MetricCard } from './components/MetricCard';
import { DateRangePicker } from './components/DateRangePicker';
import { YouTubeSection } from './components/YouTubeSection';
import { EventCard } from './components/EventCard';
import { EventsModal } from './components/EventsModal';
import { AttendanceOverview } from './components/AttendanceOverview';
import { useAnalytics } from './hooks/useAnalytics';
import { DateRange } from './types';
import { subDays } from 'date-fns';

function App() {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: subDays(new Date(), 30),
    end: new Date(),
  });
  const [showEventsModal, setShowEventsModal] = useState(false);

  const { 
    metrics, 
    youtubeMetrics,
    events, 
    loading, 
    error 
  } = useAnalytics(dateRange);

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Church Analytics Dashboard</h1>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="h-96 bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-full bg-gray-100 rounded"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Main Attendance Overview */}
            <div className="mb-8">
              <AttendanceOverview 
                total={metrics[0].value}
                change={metrics[0].change}
                adults={metrics[0].value - metrics[1].value}
                youth={85}
                kids={35}
                trend={metrics[0].trend}
              />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <MetricCard
                title="New Visitors"
                value={metrics[2].value}
                change={metrics[2].change}
                trend={metrics[2].trend}
              />
              <MetricCard
                title="New Believers"
                value={metrics[3].value}
                change={metrics[3].change}
                trend={metrics[3].trend}
              />
              <MetricCard
                title="First-Time Decisions"
                value={8}
                change={25}
                trend={[5, 6, 4, 7, 8, 7, 8]}
              />
            </div>

            {/* YouTube and Events Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {youtubeMetrics && <YouTubeSection data={youtubeMetrics} dateRange={dateRange} />}
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

export default App;