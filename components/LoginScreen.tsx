'use client';

import { Music2, Brain, TrendingUp, MessageCircle } from 'lucide-react';

export default function LoginScreen() {
  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-black flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center gap-2">
          <Music2 className="w-8 h-8 text-[#1db954]" />
          <span className="text-2xl font-bold">Listenfy</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight">
              Understand your mind<br />through music
            </h1>
            <p className="text-xl text-[#b3b3b3] max-w-2xl mx-auto">
              AI-powered mood analysis based on your Spotify listening patterns. 
              Get personalized insights and mental wellness guidance.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="spotify-card p-6">
              <Brain className="w-12 h-12 text-[#1db954] mb-4" />
              <h3 className="text-lg font-bold mb-2">Mood Analysis</h3>
              <p className="text-sm spotify-text-light">
                Discover your emotional state through audio features and listening patterns
              </p>
            </div>
            <div className="spotify-card p-6">
              <TrendingUp className="w-12 h-12 text-[#1db954] mb-4" />
              <h3 className="text-lg font-bold mb-2">Track Trends</h3>
              <p className="text-sm spotify-text-light">
                Visualize your mood changes over time with interactive charts
              </p>
            </div>
            <div className="spotify-card p-6">
              <MessageCircle className="w-12 h-12 text-[#1db954] mb-4" />
              <h3 className="text-lg font-bold mb-2">AI Assistant</h3>
              <p className="text-sm spotify-text-light">
                Chat with an empathetic AI for mental wellness support
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={handleLogin}
              className="spotify-button px-12 py-4 text-lg inline-flex items-center gap-3"
            >
              <Music2 className="w-6 h-6" />
              <span>Continue with Spotify</span>
            </button>
            <p className="text-xs spotify-text-light mt-4">
              By continuing, you agree to share your Spotify data for analysis
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center spotify-text-light text-sm">
        <p>AI-powered music mood analysis • Built with Spotify API & Google Gemini</p>
      </footer>
    </div>
  );
}
