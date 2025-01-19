import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label?: string;
      data: number[];
      backgroundColor: string[];
      borderRadius?: number;
      borderSkipped?: boolean;
    }[];
  };
  options?: any;
  height?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, options, height = '300px' }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Bar options={options || defaultOptions} data={data} />
    </div>
  );
};