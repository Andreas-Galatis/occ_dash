import React, { useState } from 'react';
import { BarChart } from './charts/BarChart';
import { format, subDays } from 'date-fns';
import { Users, TrendingUp, TrendingDown, Activity, Target, BarChart2, Calendar } from 'lucide-react';
import { Modal } from './Modal';

// Shared chart options
const baseChartOptions = {
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
        color: '#667',
        maxRotation: 45,
        minRotation: 45,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(141, 133, 50, 0.05)',
      },
      ticks: {
        font: {
          family: 'Inter, sans-serif',
          size: 12,
        },
        color: '#667',
        padding: 8,
        callback: (value: number) => value.toLocaleString(),
      },
    },
  },
};

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

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: number;
  change: number;
  color: string;
  trend: any[];
  type: 'total' | 'adults' | 'youth' | 'kids';
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  title,
  value,
  change,
  color,
  trend,
  type
}) => {
  const data = trend.map(t => ({
    date: new Date(t.date),
    value: t[type === 'total' ? 'total' : type === 'adults' ? 'adults' : type === 'youth' ? 'youth' : 'kids']
  }));

  const averageAttendance = Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length);
  const maxAttendance = Math.max(...data.map(d => d.value));
  const minAttendance = Math.min(...data.map(d => d.value));
  const growthRate = ((data[data.length - 1].value - data[0].value) / data[0].value * 100).toFixed(1);

  const chartData = {
    labels: data.map(d => format(d.date, 'MMM d')),
    datasets: [
      {
        label: title,
        data: data.map(d => d.value),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        fill: true,
      }
    ]
  };

  const modalChartOptions = {
    ...baseChartOptions,
    plugins: {
      ...baseChartOptions.plugins,
      legend: {
        display: false
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${title} Analytics`}>
      <div className="space-y-6">
        {/* Main Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <Users className="text-gray-400" size={20} />
              <span className="text-sm text-gray-500">Current</span>
            </div>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <Activity className="text-gray-400" size={20} />
              <span className="text-sm text-gray-500">Average</span>
            </div>
            <p className="text-2xl font-bold mt-2">{averageAttendance}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <Target className="text-gray-400" size={20} />
              <span className="text-sm text-gray-500">Peak</span>
            </div>
            <p className="text-2xl font-bold mt-2">{maxAttendance}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2">
              <BarChart2 className="text-gray-400" size={20} />
              <span className="text-sm text-gray-500">Growth</span>
            </div>
            <p className="text-2xl font-bold mt-2">{growthRate}%</p>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Attendance Trend</h3>
          <div className="h-80">
            <BarChart data={chartData} options={modalChartOptions} />
          </div>
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold mb-4">Key Metrics</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Minimum Attendance</span>
                <span className="font-semibold">{minAttendance}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Maximum Attendance</span>
                <span className="font-semibold">{maxAttendance}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Attendance</span>
                <span className="font-semibold">{averageAttendance}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Growth Rate</span>
                <span className={`font-semibold ${Number(growthRate) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {growthRate}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold mb-4">Attendance Distribution</h4>
            <div className="space-y-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      Range
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {minAttendance} - {maxAttendance}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div
                    style={{ width: '100%' }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Below Average</p>
                  <p className="text-xl font-semibold mt-1">
                    {data.filter(d => d.value < averageAttendance).length}
                  </p>
                  <p className="text-sm text-gray-500">days</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Above Average</p>
                  <p className="text-xl font-semibold mt-1">
                    {data.filter(d => d.value > averageAttendance).length}
                  </p>
                  <p className="text-sm text-gray-500">days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({
  total,
  change,
  adults,
  youth,
  kids,
  trend,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<null | {
    type: 'total' | 'adults' | 'youth' | 'kids';
    title: string;
    value: number;
    change: number;
    color: string;
  }>(null);

  const chartData = {
    labels: trend.map(t => format(new Date(t.date), 'MMM d')),
    datasets: [
      {
        label: 'Total',
        data: trend.map(t => t.total),
        backgroundColor: '#C4A962',
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Adults',
        data: trend.map(t => t.adults),
        backgroundColor: '#2B5174',
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Youth',
        data: trend.map(t => t.youth),
        backgroundColor: '#4A90E2',
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Kids',
        data: trend.map(t => t.kids),
        backgroundColor: '#67B8CB',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Calculate changes for each category
  const calculateChange = (current: number[], previous: number[]) => {
    const currentAvg = current.reduce((a, b) => a + b, 0) / current.length;
    const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
    return ((currentAvg - previousAvg) / previousAvg) * 100;
  };

  const midpoint = Math.floor(trend.length / 2);
  const adultChange = calculateChange(
    trend.slice(midpoint).map(t => t.adults),
    trend.slice(0, midpoint).map(t => t.adults)
  );
  const youthChange = calculateChange(
    trend.slice(midpoint).map(t => t.youth),
    trend.slice(0, midpoint).map(t => t.youth)
  );
  const kidsChange = calculateChange(
    trend.slice(midpoint).map(t => t.kids),
    trend.slice(0, midpoint).map(t => t.kids)
  );

  const AttendanceCard = ({ 
    title, 
    value, 
    change, 
    color,
    type
  }: { 
    title: string; 
    value: number; 
    change: number; 
    color: string;
    type: 'total' | 'adults' | 'youth' | 'kids';
  }) => (
    <div 
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={() => setSelectedMetric({ type, title, value, change, color })}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 font-medium">{title}</p>
        <div className={`p-2 rounded-lg ${color.replace('bg-', 'bg-opacity-10')}`}>
          <Users className={color.replace('bg-', 'text-')} size={20} />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold">{value}</p>
        <div className={`flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? (
            <TrendingUp size={16} className="mr-1" />
          ) : (
            <TrendingDown size={16} className="mr-1" />
          )}
          <span className="text-sm font-medium">
            {Math.abs(change).toFixed(1)}%
          </span>
        </div>
      </div>
      <div className={`h-1 mt-4 rounded-full ${color}`}></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AttendanceCard 
          title="Total Attendance"
          value={total}
          change={change}
          color="bg-[#C4A962]"
          type="total"
        />
        <AttendanceCard 
          title="Adults" 
          value={adults} 
          change={adultChange}
          color="bg-[#2B5174]"
          type="adults"
        />
        <AttendanceCard 
          title="Youth" 
          value={youth} 
          change={youthChange}
          color="bg-[#4A90E2]"
          type="youth"
        />
        <AttendanceCard 
          title="Kids" 
          value={kids} 
          change={kidsChange}
          color="bg-[#67B8CB]"
          type="kids"
        />
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="h-80">
          <BarChart data={chartData} options={baseChartOptions} />
        </div>
      </div>

      {selectedMetric && (
        <DetailModal
          isOpen={true}
          onClose={() => setSelectedMetric(null)}
          title={selectedMetric.title}
          value={selectedMetric.value}
          change={selectedMetric.change}
          color={selectedMetric.color}
          trend={trend}
          type={selectedMetric.type}
        />
      )}
    </div>
  );
};