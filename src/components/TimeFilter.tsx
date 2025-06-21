import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-green-400" />
        <h3 className="text-lg font-semibold text-white">Time Period</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`p-4 rounded-lg text-left transition-all duration-300 ${
              value === option.value
                ? 'bg-green-500/20 border-2 border-green-400 text-green-400'
                : 'bg-white/5 border-2 border-transparent text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="font-medium">{option.label}</div>
            <div className="text-sm opacity-70">{option.description}</div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default TimeFilter;