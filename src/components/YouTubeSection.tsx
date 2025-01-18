import React from 'react';
import { Youtube, ArrowUp, ArrowRight } from 'lucide-react';
import { LineChart } from './charts/LineChart';
import { YouTubeMetrics } from '../types';
import { format, differenceInDays } from 'date-fns';

interface YouTubeSectionProps {
  data: YouTubeMetrics;
  dateRange: DateRange;
}

export const YouTubeSection: React.FC<YouTubeSectionProps> = ({ data, dateRange }) => {
  const daysDiff = differenceInDays(dateRange.end, dateRange.start);

  const chartData = {
    labels: data.viewsData.map(d => format(new Date(d.date), 'MMM d')),
    datasets: [
      {
        label: 'Views',
        data: data.viewsData.map(d => d.views),
        borderColor: 'rgb(0, 173, 239)',
        backgroundColor: 'rgba(0, 173, 239, 0.1)',
        fill: true,
        tension: 0,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(0, 173, 239)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(0, 173, 239)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: (items: any[]) => items[0].label,
          label: (item: any) => `Views: ${item.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
          font: {
            size: 12,
          },
          color: '#666',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.06)',
          drawBorder: false,
        },
        ticks: {
          callback: (value: number) => value.toLocaleString(),
          font: {
            size: 12,
          },
          color: '#666',
          padding: 8,
        },
        position: 'right',
      },
    },
    interaction: {
      intersect: false,
      mode: 'nearest',
      axis: 'x',
    },
    hover: {
      mode: 'nearest',
      intersect: false,
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Your channel got {data.totalViews.toLocaleString()} views in the last {daysDiff} days
        </h2>
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <ArrowUp className="text-green-500" size={16} />
            <span className="text-sm text-gray-600">110 more than usual</span>
          </div>
          <div className="flex items-center space-x-2">
            <ArrowRight className="text-gray-400" size={16} />
            <span className="text-sm text-gray-600">About the same as usual</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Views</span>
            <span className="text-2xl font-semibold">{data.totalViews.toLocaleString()}</span>
            <div className="flex items-center mt-1 text-green-500 text-sm">
              <ArrowUp size={14} className="mr-1" />
              <span>110 more than usual</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Watch time (hours)</span>
            <span className="text-2xl font-semibold">{data.watchTime.toLocaleString()}</span>
            <span className="text-sm text-gray-500 mt-1">About the same as usual</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Subscribers</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-semibold">+{data.subscribers}</span>
            </div>
            <span className="text-sm text-green-500 mt-1">
              {data.subscriberChange >= 0 ? '+' : ''}{data.subscriberChange.toFixed(1)}% vs previous {daysDiff} days
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="h-[400px]">
          <LineChart data={chartData} options={chartOptions} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top videos</h3>
          <span className="text-sm text-gray-500">Last {daysDiff} days</span>
        </div>
        <div className="space-y-3">
          {data.videos.map((video, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center mr-4">
                <Youtube size={20} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{video.title}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{video.views.toLocaleString()} views</span>
                  <span>{video.likes.toLocaleString()} likes</span>
                  <span>Avg. {video.avgWatchTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};