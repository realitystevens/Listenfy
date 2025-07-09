import React, { useState, useEffect } from 'react';
import { getTopTracks, getAudioFeatures, analyzeMood } from '../services/api';

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

const MoodAnalysis: React.FC<MoodAnalysisProps> = ({ timeRange }) => {
  const [moodData, setMoodData] = useState<MoodAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoodAnalysis = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get top tracks
        const tracksData = await getTopTracks(timeRange, 50);
        const trackIds = tracksData.items.map((track: Track) => track.id);

        // Get audio features
        const audioFeaturesData = await getAudioFeatures(trackIds.join(','));

        // Analyze mood
        const analysis = await analyzeMood(audioFeaturesData.audio_features, timeRange);

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

  if (isLoading) {
    return (
      <div>
        <span>Analyzing your musical mood...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <span>Alert Icon</span>
        <p>{error}</p>
      </div>
    );
  }

  if (!moodData) return null;

  // Helper functions for mood color and icon
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

  return (
    <div>
      {/* Main Mood Card */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            className={`w-24 h-24 bg-gradient-to-r ${getMoodColor(moodData.mood)} rounded-full flex items-center justify-center text-4xl mx-auto mb-4`}
          >
            {getMoodIcon(moodData.mood)}
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
            You're feeling {moodData.mood}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', color: '#bbb' }}>
            <span>Trending up</span>
            <span>Confidence: {Math.round(moodData.confidence * 100)}%</span>
          </div>
        </div>

        {/* Advice/Encouragement */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '1rem',
            background: moodData.advice ? 'rgba(59,130,246,0.2)' : 'rgba(34,197,94,0.2)',
            border: moodData.advice ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(34,197,94,0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span>{moodData.advice ? '⚠️' : '✅'}</span>
            <p style={{ color: '#fff', lineHeight: 1.6 }}>
              {moodData.advice || moodData.encouragement}
            </p>
          </div>
        </div>
      </div>

      {/* Audio Features */}
      <div>
        <div>
          <span>🎵</span>
          <h3>Musical Characteristics</h3>
        </div>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { key: 'valence', label: 'Positivity', value: moodData.features.valence },
            { key: 'energy', label: 'Energy', value: moodData.features.energy },
            { key: 'danceability', label: 'Danceability', value: moodData.features.danceability },
            { key: 'acousticness', label: 'Acoustic', value: moodData.features.acousticness }
          ].map((feature) => (
            <div key={feature.key} style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  margin: '0 auto',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: 'linear-gradient(to right, #22d3ee, #6366f1)',
                      clipPath: `polygon(0 ${100 - feature.value * 100}%, 100% ${100 - feature.value * 100}%, 100% 100%, 0% 100%)`
                    }}
                  />
                  <span style={{ position: 'relative', color: '#fff', fontWeight: 600 }}>
                    {Math.round(feature.value * 100)}%
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#bbb' }}>{feature.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      {moodData.insights && moodData.insights.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span>✨</span>
            <h3>Personal Insights</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {moodData.insights.map((insight: string, index: number) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '0.5rem'
                }}
              >
                <div style={{ width: '0.5rem', height: '0.5rem', background: '#a78bfa', borderRadius: '50%', marginTop: '0.5rem', flexShrink: 0 }} />
                <p style={{ color: '#bbb' }}>{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodAnalysis;