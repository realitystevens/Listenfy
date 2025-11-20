'use client';

import { Music2 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="bg-[#1db954] p-6 rounded-full animate-pulse">
            <Music2 className="w-16 h-16 text-black" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white">Loading Listenfy...</h2>
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-[#1db954] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-[#1db954] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-[#1db954] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
