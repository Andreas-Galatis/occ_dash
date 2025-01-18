import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import { Modal } from './Modal';
import { format, subDays } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  trend: number[];
  detailedData?: {
    labels: string[];
    values: number[];
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend,
  detailedData = {
    labels: Array.from({ length: 30 }, (_, i) => format(subDays(new Date(), 29 - i), 'MMM d')),
    values: Array.from({ length: 30 }, () => Math.floor(Math.random() * (1500 - 500 + 1)) + 500),
  },
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const trendData = {
    labels: trend.map((_, i) => i + 1),
    datasets: [
      {
        data: trend,
        borderColor: change >= 0 ? '#10B981' : '#EF4444',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const detailedChartData = {
    labels: detailedData.labels,
    datasets: [
      {
        label: title,
        data: detailedData.values,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    maintainAspectRatio: false,
  };

  const detailedOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: { display: true },
      y: { 
        display: true,
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <>
      <div 
        className="bg-white rounded-xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold">{value.toLocaleString()}</span>
          <div
            className={`flex items-center ${
              change >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {change >= 0 ? (
              <TrendingUp size={20} className="mr-1" />
            ) : (
              <TrendingDown size={20} className="mr-1" />
            )}
            <span className="font-medium">
              {Math.abs(change)}%
            </span>
          </div>
        </div>
        <div className="h-16">
          <Line data={trendData} options={options} />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${title} Details`}
      >
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Current Value</p>
                <p className="text-xl font-semibold">{value.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Change</p>
                <p className={`text-xl font-semibold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {change >= 0 ? '+' : ''}{change}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">30-Day Average</p>
                <p className="text-xl font-semibold">
                  {Math.round(detailedData.values.reduce((a, b) => a + b, 0) / detailedData.values.length).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="h-80">
            <Line data={detailedChartData} options={detailedOptions} />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Key Insights</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-gray-600">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                Highest value: {Math.max(...detailedData.values).toLocaleString()}
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                Lowest value: {Math.min(...detailedData.values).toLocaleString()}
              </li>
              <li className="flex items-center text-gray-600">
                <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                Trend: {change >= 0 ? 'Upward' : 'Downward'} trend over the past month
              </li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
};