import React from 'react';
import { LineChart } from './charts/LineChart';
import { format, subDays } from 'date-fns';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';

interface AttendanceOverviewProps {
  total: number;
  change: number;
  adults: number;
  youth: number;
  kids: number;
  trend: number[];
}

export const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({
  total,
  change,
  adults,
  youth,
  kids,
  trend,
}) => {
  const chartData = {
    labels: Array.from({ length: trend.length }, (_, i) => 
      format(subDays(new Date(), trend.length - 1 - i), 'MMM d')
    ),
    datasets: [
      {
        label: 'Total Attendance',
        data: trend,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
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
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Total Attendance</h2>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold">{total}</span>
                <div className={`flex items-center ${
                  change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
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
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Adults</p>
            <p className="text-xl font-semibold">{adults}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Youth</p>
            <p className="text-xl font-semibold">{youth}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Kids</p>
            <p className="text-xl font-semibold">{kids}</p>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <LineChart data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};