import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMoodTrends } from '../services/api';

type MoodTrend = {
  date: string;
  mood: string;
  confidence: number;
};

const MoodTrends: React.FC = () => {
  const [trends, setTrends] = useState<MoodTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await getMoodTrends();
        setTrends(data);
      } catch (error) {
        console.error('Failed to fetch trends:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrends();
  }, []);

  if (isLoading) {
    return (
      <span className="">Loading mood trends...</span>
    );
  }

  return (
    <div className="space-y-6">
      <div className="">
        <div className="flex items-center space-x-2 mb-6">
          <span>Trending Up Icon</span>
          <h3 className="te">Mood Trends Over Time</h3>
        </div>

        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="confidence" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="">
          {trends.slice(-3).map((trend, index) => (
            <div
              key={index}
              className=""
            >
              <div className="">
                <span>Calendar Icon</span>
                <span className="text-sm text-gray-400">{trend.date}</span>
              </div>
              <div className="text-lg font-semibold text-white capitalize">
                {trend.mood}
              </div>
              <div className="text-sm text-green-400">
                {Math.round(trend.confidence * 100)}% confidence
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodTrends;