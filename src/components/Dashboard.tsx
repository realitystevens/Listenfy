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
  const [activeTab, setActiveTab] = useState<'analysis' | 'trends' | 'music'>('analysis');
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
    { id: 'trends', name: 'Trends' },
    { id: 'music', name: 'Music Insights' }
  ] as const;

  return (
    <div>
      {/* Header */}
      <header>
        <div className="header_content">
          <div>Listenfy</div>
          <div>
            {userProfile && (
              <div>
                <span className='profile_icon'></span>
                <span>{userProfile.display_name}</span>
              </div>
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <section>
        <div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 'active-tab' : ''}
            >
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Time Filter */}
      <div>
        <TimeFilter value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Main Content */}
      <main>
        <div key={activeTab}>
          {activeTab === 'analysis' && <MoodAnalysis timeRange={timeRange} />}
          {activeTab === 'trends' && <MoodTrends />}
          {activeTab === 'music' && <div>Music Insights Coming Soon...</div>}
        </div>
      </main>

      {/* Floating Chat Button */}
      <button onClick={() => setIsChatOpen(true)}>
        <span>Message Circle</span>
      </button>

      {/* Chat Interface */}
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Dashboard;