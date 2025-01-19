import React from 'react';
import { Calendar } from 'lucide-react';
import { DateRange } from '../types';
import { subDays, subMonths, subYears } from 'date-fns';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  const handleRangeChange = (rangeValue: string) => {
    const end = new Date();
    let start: Date;

    switch (rangeValue) {
      case '7d':
        start = subDays(end, 7);
        break;
      case '14d':
        start = subDays(end, 14);
        break;
      case '30d':
        start = subDays(end, 30);
        break;
      case '3m':
        start = subMonths(end, 3);
        break;
      case '1y':
        start = subYears(end, 1);
        break;
      default:
        start = subDays(end, 7);
    }

    onChange({ start, end });
  };

  // Calculate current range value
  const getDaysRange = () => {
    const diffTime = Math.abs(value.end.getTime() - value.start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return '7d';
    if (diffDays <= 14) return '14d';
    if (diffDays <= 30) return '30d';
    if (diffDays <= 90) return '3m';
    if (diffDays <= 365) return '1y';
    return '7d';
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
        <Calendar size={20} className="text-gray-500" />
        <select 
          className="bg-transparent border-none focus:ring-0 text-gray-700"
          value={getDaysRange()}
          onChange={(e) => handleRangeChange(e.target.value)}
        >
          <option value="7d">Last 7 Days</option>
          <option value="14d">Last 14 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="3m">Last 3 Months</option>
          <option value="1y">Last Year</option>
        </select>
      </div>
    </div>
  );
};