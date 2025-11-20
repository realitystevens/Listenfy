'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Loader2 } from 'lucide-react';

type MoodTrend = {
  date: string;
  mood: string;
  confidence: number;
};

export default function MoodTrends() {
  const [trends, setTrends] = useState<MoodTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch('/api/mood/trends', {
          credentials: 'include',
        });
        const data = await response.json();
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
      <div className="spotify-card rounded-2xl p-12 text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-[#1db954]" />
        <p className="spotify-text-light">Loading mood trends...</p>
      </div>
    );
  }

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      euphoric: 'text-yellow-400',
      happy: 'text-[#1db954]',
      content: 'text-blue-400',
      neutral: 'text-[#b3b3b3]',
      melancholic: 'text-purple-400',
      sad: 'text-indigo-400',
      aggressive: 'text-red-400'
    };
    return colors[mood] || colors.neutral;
  };

  return (
    <div className="space-y-6">
      <div className="spotify-card rounded-2xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-[#1db954]" />
          <h3 className="text-xl font-black">Mood Trends Over Time</h3>
        </div>

        <div className="h-80 mb-8 bg-[#121212] rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                domain={[0, 1]}
                tickFormatter={(value) => `${Math.round(value * 100)}%`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#181818',
                  border: '1px solid #282828',
                  borderRadius: '8px',
                  color: 'white',
                  padding: '12px'
                }}
                formatter={(value: number) => [`${Math.round(value * 100)}%`, 'Confidence']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="confidence" 
                stroke="#1db954" 
                strokeWidth={3}
                dot={{ fill: '#1db954', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-bold mb-4">Recent History</h4>
          {trends.slice(-5).reverse().map((trend, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-[#121212] hover:bg-[#282828] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 spotify-text-light" />
                <span className="text-sm spotify-text-light font-bold">{trend.date}</span>
              </div>
              <div className={`text-lg font-bold capitalize ${getMoodColor(trend.mood)}`}>
                {trend.mood}
              </div>
              <div className="text-sm text-[#1db954] font-bold">
                {Math.round(trend.confidence * 100)}% confidence
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
