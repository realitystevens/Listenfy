'use client';

import { Clock } from 'lucide-react';

interface TimeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TimeFilter({ value, onChange }: TimeFilterProps) {
  const timeRanges = [
    { value: 'short_term', label: 'Last 4 Weeks' },
    { value: 'medium_term', label: 'Last 6 Months' },
    { value: 'long_term', label: 'All Time' }
  ];

  return (
    <div className="spotify-card p-4">
      <div className="flex items-center gap-3 mb-3">
        <Clock className="w-5 h-5 text-[#1db954]" />
        <h3 className="font-bold text-white">Time Period</h3>
      </div>
      
      <div className="flex gap-2">
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => onChange(range.value)}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all ${
              value === range.value
                ? 'bg-[#1db954] text-black'
                : 'bg-[#282828] spotify-text-light hover:bg-[#3e3e3e] hover:text-white'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
