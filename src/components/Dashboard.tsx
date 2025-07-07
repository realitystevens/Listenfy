import React, { useState, useEffect } from 'react';
import MoodAnalysis from './MoodAnalysis';
import ChatInterface from './ChatInterface';
import TimeFilter from './TimeFilter';
import MoodTrends from './MoodTrends';
import { getUserProfile, logout } from '../services/api';

interface DashboardProps {
  onLogout: () => void;
}

interface UserProfile {
  display_name: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [timeRange, setTimeRange] = useState('medium_term');
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const tabs = [
    { id: 'analysis', name: 'Mood Analysis' },
    { id: 'trends', name: 'Trends'},
    { id: 'music', name: 'Music Insights'}
  ];

  return (
    <div>
      {/* Header */}
      <header>
        <div className="header_content">
          <div>Listenfy</div>

          <div className="">
            {userProfile && (
              <div className="">
                <span className='profile_icon'></span>
                <span className="">{userProfile.display_name}</span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className=""
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <section className="">
        <div className="">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex ${
                activeTab === tab.id
                  ? 'border-green-400 text-green-400'
                  : 'border-transparent0'
              }`}
            >
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Time Filter */}
      <div className="">
        <TimeFilter value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Main Content */}
      <main className="">
        <div
          key={activeTab}
        >
          {activeTab === 'analysis' && <MoodAnalysis timeRange={timeRange} />}
          {activeTab === 'trends' && <MoodTrends />}
          {activeTab === 'music' && <div className="text-white">Music Insights Coming Soon...</div>}
        </div>
      </main>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className=""
      >
        <span>Message Circle</span>
      </button>

      {/* Chat Interface */}
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Dashboard;