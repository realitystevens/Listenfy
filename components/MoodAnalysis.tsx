'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Sparkles, Activity, Music, TrendingUp } from 'lucide-react';

interface MoodAnalysisProps {
  timeRange: string;
}

interface MoodFeatures {
  valence: number;
  energy: number;
  danceability: number;
  acousticness: number;
}

interface MoodAnalysisData {
  mood: string;
  confidence: number;
  advice?: string;
  encouragement?: string;
  features: MoodFeatures;
  insights?: string[];
}

interface Track {
  id: string;
}

export default function MoodAnalysis({ timeRange }: MoodAnalysisProps) {
  const [moodData, setMoodData] = useState<MoodAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoodAnalysis = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get top tracks
        const tracksResponse = await fetch(`/api/spotify/top-tracks?time_range=${timeRange}&limit=50`, {
          credentials: 'include',
        });
        const tracksData = await tracksResponse.json();
        const trackIds = tracksData.items.map((track: Track) => track.id);

        // Get audio features
        const audioResponse = await fetch(`/api/spotify/audio-features?ids=${trackIds.join(',')}`, {
          credentials: 'include',
        });
        const audioData = await audioResponse.json();

        // Analyze mood
        const moodResponse = await fetch('/api/mood/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ 
            audioFeatures: audioData.audio_features, 
            timeRange 
          }),
        });
        const analysis = await moodResponse.json();

        setMoodData(analysis);
      } catch (error) {
        console.error('Failed to analyze mood:', error);
        setError('Failed to analyze your music. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoodAnalysis();
  }, [timeRange]);

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      euphoric: 'from-yellow-400 to-orange-500',
      happy: 'from-green-400 to-blue-500',
      content: 'from-blue-400 to-purple-500',
      neutral: 'from-gray-400 to-gray-600',
      melancholic: 'from-purple-500 to-indigo-600',
      sad: 'from-indigo-500 to-purple-700',
      aggressive: 'from-red-500 to-orange-600'
    };
    return colors[mood] || colors.neutral;
  };

  const getMoodIcon = (mood: string) => {
    const icons: Record<string, string> = {
      euphoric: '🎉',
      happy: '😊',
      content: '😌',
      neutral: '😐',
      melancholic: '😔',
      sad: '😢',
      aggressive: '😤'
    };
    return icons[mood] || '😐';
  };

  if (isLoading) {
    return (
      <div className="spotify-card rounded-2xl p-12 text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-[#1db954]" />
        <p className="spotify-text-light">Analyzing your musical mood...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="spotify-card rounded-2xl p-8 text-center border-2 border-red-500/20">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  if (!moodData) return null;

  return (
    <div className="space-y-6">
      {/* Main Mood Card */}
      <div className="spotify-card rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className={`w-32 h-32 mx-auto bg-gradient-to-br ${getMoodColor(moodData.mood)} rounded-full flex items-center justify-center text-6xl shadow-2xl`}>
            {getMoodIcon(moodData.mood)}
          </div>
          
          <div>
            <h2 className="text-4xl font-black mb-2">
              You're feeling <span className="text-[#1db954] capitalize">{moodData.mood}</span>
            </h2>
            <div className="flex items-center justify-center gap-3 spotify-text-light">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-bold">Confidence: {Math.round(moodData.confidence * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Advice/Encouragement */}
        <div className={`rounded-xl p-6 ${
          moodData.advice 
            ? 'bg-blue-500/10 border-2 border-blue-500/20' 
            : 'bg-[#1db954]/10 border-2 border-[#1db954]/20'
        }`}>
          <div className="flex items-start gap-3">
            {moodData.advice ? (
              <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            ) : (
              <Sparkles className="w-6 h-6 text-[#1db954] flex-shrink-0 mt-1" />
            )}
            <p className="text-white leading-relaxed font-medium">
              {moodData.advice || moodData.encouragement}
            </p>
          </div>
        </div>
      </div>

      {/* Audio Features */}
      <div className="spotify-card rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-6 h-6 text-[#1db954]" />
          <h3 className="text-xl font-black">Musical Characteristics</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { key: 'valence', label: 'Positivity', value: moodData.features.valence, color: 'from-green-400 to-emerald-500' },
            { key: 'energy', label: 'Energy', value: moodData.features.energy, color: 'from-red-400 to-orange-500' },
            { key: 'danceability', label: 'Danceability', value: moodData.features.danceability, color: 'from-purple-400 to-pink-500' },
            { key: 'acousticness', label: 'Acoustic', value: moodData.features.acousticness, color: 'from-blue-400 to-cyan-500' }
          ].map((feature) => (
            <div key={feature.key} className="text-center bg-[#121212] rounded-lg p-4 hover:bg-[#282828] transition-colors">
              <div className="mb-3">
                <div className="relative w-20 h-20 mx-auto">
                  {/* Background circle */}
                  <svg className="transform -rotate-90 w-20 h-20">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#1db954"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - feature.value)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {Math.round(feature.value * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm spotify-text-light font-bold">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      {moodData.insights && moodData.insights.length > 0 && (
        <div className="spotify-card rounded-2xl p-8 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-[#1db954]" />
            <h3 className="text-xl font-black">Personal Insights</h3>
          </div>
          
          <div className="space-y-3">
            {moodData.insights.map((insight: string, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-[#121212] hover:bg-[#282828] transition-colors"
              >
                <div className="w-2 h-2 bg-[#1db954] rounded-full flex-shrink-0 mt-2" />
                <p className="spotify-text-light leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
