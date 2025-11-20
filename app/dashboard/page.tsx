'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MoodAnalysis from '@/components/MoodAnalysis';
import ChatInterface from '@/components/ChatInterface';
import TimeFilter from '@/components/TimeFilter';
import MoodTrends from '@/components/MoodTrends';
import LoadingScreen from '@/components/LoadingScreen';
import { Music, TrendingUp, BarChart3, LogOut, User, MessageCircle } from 'lucide-react';

interface UserProfile {
  display_name: string;
  images?: { url: string }[];
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'trends' | 'music'>('analysis');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [timeRange, setTimeRange] = useState('medium_term');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check authentication
        const authResponse = await fetch('/api/auth/status', {
          credentials: 'include',
        });
        const authData = await authResponse.json();

        if (!authData.isAuthenticated) {
          router.push('/');
          return;
        }

        // Fetch user profile
        const profileResponse = await fetch('/api/spotify/profile', {
          credentials: 'include',
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserProfile(profileData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const tabs = [
    { id: 'analysis' as const, name: 'Mood Analysis', icon: Music },
    { id: 'trends' as const, name: 'Trends', icon: TrendingUp },
    { id: 'music' as const, name: 'Music Insights', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-[#121212] sticky top-0 z-40 border-b border-[#282828]">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-8 h-8 text-[#1db954]" />
              <h1 className="text-2xl font-bold">Listenfy</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {userProfile && (
                <div className="flex items-center gap-3 bg-[#181818] px-4 py-2 rounded-full hover:bg-[#282828] transition-colors">
                  {userProfile.images?.[0]?.url ? (
                    <img 
                      src={userProfile.images[0].url} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1db954] flex items-center justify-center">
                      <User className="w-5 h-5 text-black" />
                    </div>
                  )}
                  <span className="text-sm font-bold hidden sm:block">
                    {userProfile.display_name}
                  </span>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[#282828] spotify-text-light hover:text-white transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block text-sm font-bold">Log out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-[#121212] border-b border-[#282828]">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-bold text-sm whitespace-nowrap transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'text-[#1db954] border-[#1db954]'
                      : 'text-[#b3b3b3] border-transparent hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time Filter */}
      <div className="bg-gradient-to-b from-[#121212] to-black">
        <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-6">
          <TimeFilter value={timeRange} onChange={setTimeRange} />
        </div>

        {/* Main Content */}
        <main className="max-w-screen-2xl mx-auto px-4 lg:px-8 pb-24">
          <div key={activeTab}>
            {activeTab === 'analysis' && <MoodAnalysis timeRange={timeRange} />}
            {activeTab === 'trends' && <MoodTrends />}
            {activeTab === 'music' && (
              <div className="spotify-card p-12 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-[#1db954]" />
                <h3 className="text-2xl font-bold mb-2">Music Insights Coming Soon</h3>
                <p className="spotify-text-light">
                  Detailed analysis of your listening patterns and preferences
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-[#1db954] shadow-2xl hover:scale-105 transition-all flex items-center justify-center group"
      >
        <MessageCircle className="w-7 h-7 text-black" />
      </button>

      {/* Chat Interface */}
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
