import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Heart, Brain, Sparkles } from 'lucide-react';
import { initiateSpotifyLogin } from '../services/api';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await initiateSpotifyLogin();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full">
              <Music className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
          >
            Listenify
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Discover your musical mood patterns, get personalized insights, and chat with our AI therapist for emotional wellness guidance.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Heart,
              title: "Mood Analysis",
              description: "Advanced AI analyzes your Spotify listening patterns to understand your emotional state and provide personalized insights.",
              delay: 0.5
            },
            {
              icon: Brain,
              title: "AI Therapy",
              description: "Chat with our compassionate AI therapist for support, advice, and personalized playlist recommendations.",
              delay: 0.6
            },
            {
              icon: Sparkles,
              title: "Smart Insights",
              description: "Get detailed analytics with time filters, mood trends, and therapeutic guidance based on your music preferences.",
              delay: 0.7
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: feature.delay }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <feature.icon className="w-10 h-10 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              'Connect with Spotify'
            )}
          </button>
          
          <p className="text-gray-400 mt-4 text-sm">
            We'll analyze your music to provide personalized mood insights and therapeutic support
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;