import React from 'react';

interface TimeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeFilter: React.FC<TimeFilterProps> = ({ value, onChange }) => {
  const options = [
    { value: 'short_term', label: 'Last 4 weeks', description: 'Recent listening' },
    { value: 'medium_term', label: 'Last 6 months', description: 'Medium term' },
    { value: 'long_term', label: 'All time', description: 'Long term patterns' }
  ];

  return (
    <div className="">  
      <div className="">
        <span>Clock Icon</span>
        <h3 className="">Time Period</h3>
      </div>

      <div className="">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`p-4 ${
              value === option.value
                ? 'bg-green'
                : 'bg-white/5'
            }`}
          >
            <div className="font-medium">{option.label}</div>
            <div className="text-sm opacity-70">{option.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeFilter;