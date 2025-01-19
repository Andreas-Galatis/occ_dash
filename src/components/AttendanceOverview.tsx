import React from 'react';
import { BarChart } from './charts/BarChart';
import { format } from 'date-fns';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';

interface AttendanceOverviewProps {
  total: number;
  change: number;
  adults: number;
  youth: number;
  kids: number;
  trend: {
    date: Date;
    total: number;
    adults: number;
    youth: number;
    kids: number;
  }[];
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
    labels: trend.map(t => format(new Date(t.date), 'MMM d')),
    datasets: [
      {
        label: 'Total',
        data: trend.map(t => t.total),
        backgroundColor: '#C4A962', // Gold (primary brand color)
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Adults',
        data: trend.map(t => t.adults),
        backgroundColor: '#2B5174', // Deep blue
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Youth',
        data: trend.map(t => t.youth),
        backgroundColor: '#4A90E2', // Bright blue
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Kids',
        data: trend.map(t => t.kids),
        backgroundColor: '#67B8CB', // Light blue
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y} attendees`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          color: '#666',
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          color: '#666',
          padding: 8,
          callback: (value: number) => value.toLocaleString(),
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-[#C4A962] bg-opacity-10 rounded-lg">
              <Users className="text-[#C4A962]" size={24} />
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
                    {Math.abs(change).toFixed(1)}%
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
      
      <div className="h-80">
        <BarChart data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};