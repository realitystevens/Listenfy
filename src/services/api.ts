const API_BASE = import.meta.env.PROD ? '/api' : 'http://127.0.0.1:5000/api';

// Auth endpoints
export const checkAuthStatus = async () => {
  const response = await fetch(`${API_BASE}/auth/status`, {
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error('Failed to check auth status');
  }
  return response.json();
};

export const initiateSpotifyLogin = async () => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    credentials: 'include'
  });
  return response.json();
};

export const logout = async () => {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  return response.json();
};

// Spotify endpoints
export const getUserProfile = async () => {
  const response = await fetch(`${API_BASE}/spotify/profile`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
};

export const getTopTracks = async (timeRange: string = 'medium_term', limit: number = 50) => {
  const response = await fetch(`${API_BASE}/spotify/top-tracks?time_range=${timeRange}&limit=${limit}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch top tracks');
  }
  
  return response.json();
};

export const getTopArtists = async (timeRange: string = 'medium_term', limit: number = 50) => {
  const response = await fetch(`${API_BASE}/spotify/top-artists?time_range=${timeRange}&limit=${limit}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch top artists');
  }
  
  return response.json();
};

export const getRecentTracks = async (limit: number = 50) => {
  const response = await fetch(`${API_BASE}/spotify/recent?limit=${limit}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch recent tracks');
  }
  
  return response.json();
};

export const getAudioFeatures = async (trackIds: string) => {
  const response = await fetch(`${API_BASE}/spotify/audio-features?ids=${trackIds}`, {
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('Failed to fetch audio features:', error);
    throw new Error(error.error || 'Failed to fetch audio features');
  }
  
  return response.json();
};

export const createPlaylist = async (name: string, description: string, trackUris: string[]) => {
  const response = await fetch(`${API_BASE}/spotify/create-playlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ name, description, trackUris })
  });
  
  if (!response.ok) {
    throw new Error('Failed to create playlist');
  }
  
  return response.json();
};

// Mood analysis endpoints
export interface AudioFeature {
  [key: string]: unknown;
}

export const analyzeMood = async (audioFeatures: AudioFeature[], timeRange: string) => {
  const response = await fetch(`${API_BASE}/mood/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ audioFeatures, timeRange })
  });
  
  if (!response.ok) {
    throw new Error('Failed to analyze mood');
  }
  
  return response.json();
};

export const getMoodTrends = async () => {
  const response = await fetch(`${API_BASE}/mood/trends`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch mood trends');
  }
  
  return response.json();
};

// Chat endpoints
export const sendChatMessage = async (
  message: string,
  moodContext?: Record<string, unknown>,
  conversationHistory?: unknown[]
) => {
  const response = await fetch(`${API_BASE}/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ message, moodContext, conversationHistory })
  });
  
  if (!response.ok) {
    throw new Error('Failed to send chat message');
  }
  
  return response.json();
};

export const generatePlaylistRecommendation = async (currentMood: string, desiredMood: string, context?: string) => {
  const response = await fetch(`${API_BASE}/chat/playlist-recommendation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ currentMood, desiredMood, context })
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate playlist recommendation');
  }
  
  return response.json();
};