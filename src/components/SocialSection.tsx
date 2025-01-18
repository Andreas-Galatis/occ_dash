import React from 'react';
import { Share2, TrendingUp, TrendingDown } from 'lucide-react';
import { BarChart } from './charts/BarChart';
import { SocialMetrics } from '../types';

interface SocialSectionProps {
  data: SocialMetrics;
  compact?: boolean;
}

export const SocialSection: React.FC<SocialSectionProps> = ({ data, compact = false }) => {
  const chartData = {
    labels: data.platforms.map(p => p.name),
    datasets: [
      {
        label: 'Engagements',
        data: data.platforms.map(p => p.engagements),
        backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(37, 99, 235, 0.8)'],
      },
    ],
  };

  if (compact) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center space-x-3 mb-3">
          <Share2 className="text-blue-500" size={20} />
          <div>
            <p className="text-lg font-semibold">{data.totalEngagements.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Engagements</p>
          </div>
        </div>
        <div className="space-y-2">
          {data.platforms.map((platform, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{platform.name}</span>
              <div className={`flex items-center ${
                platform.change >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {platform.change >= 0 ? (
                  <TrendingUp size={14} className="mr-1" />
                ) : (
                  <TrendingDown size={14} className="mr-1" />
                )}
                <span>{Math.abs(platform.change)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Social Media Engagement</h2>
      <div className="flex items-center space-x-4 mb-4">
        <Share2 className="text-blue-500" size={24} />
        <div>
          <p className="text-2xl font-bold">{data.totalEngagements.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Engagements</p>
        </div>
      </div>
      <BarChart data={chartData} />
      <div className="mt-6 grid grid-cols-3 gap-4">
        {data.platforms.map((platform, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700">{platform.name}</h3>
            <p className="text-lg font-semibold mt-1">
              {platform.engagements.toLocaleString()}
            </p>
            <div className={`flex items-center mt-2 ${
              platform.change >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {platform.change >= 0 ? (
                <TrendingUp size={16} className="mr-1" />
              ) : (
                <TrendingDown size={16} className="mr-1" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(platform.change)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};