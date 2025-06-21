import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Music, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { getTopTracks, getAudioFeatures, analyzeMood } from '../services/api';

interface MoodAnalysisProps {
  timeRange: string;
}

const MoodAnalysis: React.FC<MoodAnalysisProps> = ({ timeRange }) => {
  const [moodData, setMoodData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoodAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get top tracks
        const tracksData = await getTopTracks(timeRange, 50);
        const trackIds = tracksData.items.map((track: any) => track.id);
        
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
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full"
        />
        <span className="ml-3 text-white">Analyzing your musical mood...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  if (!moodData) return null;

  const getMoodColor = (mood: string) => {
    const colors = {
      euphoric: 'from-yellow-400 to-orange-500',
      happy: 'from-green-400 to-blue-500',
      content: 'from-blue-400 to-purple-500',
      neutral: 'from-gray-400 to-gray-600',
      melancholic: 'from-purple-500 to-indigo-600',
      sad: 'from-indigo-500 to-purple-700',
      aggressive: 'from-red-500 to-orange-600'
    };
    return colors[mood as keyof typeof colors] || colors.neutral;
  };

  const getMoodIcon = (mood: string) => {
    const icons = {
      euphoric: '🎉',
      happy: '😊',
      content: '😌',
      neutral: '😐',
      melancholic: '😔',
      sad: '😢',
      aggressive: '😤'
    };
    return icons[mood as keyof typeof icons] || '😐';
  };

  return (
    <div className="space-y-6">
      {/* Main Mood Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className={`w-24 h-24 bg-gradient-to-r ${getMoodColor(moodData.mood)} rounded-full flex items-center justify-center text-4xl mx-auto mb-4`}
          >
            {getMoodIcon(moodData.mood)}
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-2 capitalize">
            You're feeling {moodData.mood}
          </h2>
          
          <div className="flex items-center justify-center space-x-2 text-gray-300">
            <TrendingUp className="w-5 h-5" />
            <span>Confidence: {Math.round(moodData.confidence * 100)}%</span>
          </div>
        </div>

        {/* Advice/Encouragement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-xl ${
            moodData.advice 
              ? 'bg-blue-500/20 border border-blue-500/30' 
              : 'bg-green-500/20 border border-green-500/30'
          }`}
        >
          <div className="flex items-start space-x-3">
            {moodData.advice ? 
              <AlertCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" /> :
              <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
            }
            <p className="text-white leading-relaxed">
              {moodData.advice || moodData.encouragement}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Audio Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Music className="w-5 h-5 text-green-400" />
          <h3 className="text-xl font-semibold text-white">Musical Characteristics</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'valence', label: 'Positivity', value: moodData.features.valence },
            { key: 'energy', label: 'Energy', value: moodData.features.energy },
            { key: 'danceability', label: 'Danceability', value: moodData.features.danceability },
            { key: 'acousticness', label: 'Acoustic', value: moodData.features.acousticness }
          ].map((feature) => (
            <div key={feature.key} className="text-center">
              <div className="mb-2">
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center relative">
                  <div 
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                    style={{
                      clipPath: `polygon(0 ${100 - feature.value * 100}%, 100% ${100 - feature.value * 100}%, 100% 100%, 0% 100%)`
                    }}
                  />
                  <span className="relative text-white font-semibold">
                    {Math.round(feature.value * 100)}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-300">{feature.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Insights */}
      {moodData.insights && moodData.insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Personal Insights</h3>
          </div>

          <div className="space-y-3">
            {moodData.insights.map((insight: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg"
              >
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">{insight}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MoodAnalysis;