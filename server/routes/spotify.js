import express from 'express';
import axios from 'axios';

const router = express.Router();
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

// Helper to call Spotify API
async function spotifyRequest(req, endpoint, options = {}) {
  const accessToken = req.session.accessToken;
  if (!accessToken) throw new Error('No access token');
  const url = `${SPOTIFY_API_BASE}${endpoint}`;
  try {
    const response = await axios({
      url,
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      data: options.data || undefined,
      params: options.params || undefined,
    });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      body: error.response?.data || error.message
    };
  }
}

// Get user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const data = await spotifyRequest(req, '/me');
    res.json(data);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(error.status || 500).json({ error: 'Failed to fetch profile', details: error.body });
  }
});

// Get top tracks with time range
router.get('/top-tracks', requireAuth, async (req, res) => {
  try {
    const { time_range = 'medium_term', limit = 50 } = req.query;
    const data = await spotifyRequest(req, '/me/top/tracks', {
      params: { time_range, limit }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    res.status(error.status || 500).json({ error: 'Failed to fetch top tracks', details: error.body });
  }
});

// Get top artists with time range
router.get('/top-artists', requireAuth, async (req, res) => {
  try {
    const { time_range = 'medium_term', limit = 50 } = req.query;
    const data = await spotifyRequest(req, '/me/top/artists', {
      params: { time_range, limit }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching top artists:', error);
    res.status(error.status || 500).json({ error: 'Failed to fetch top artists', details: error.body });
  }
});

// Get recently played tracks
router.get('/recent', requireAuth, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const data = await spotifyRequest(req, '/me/player/recently-played', {
      params: { limit }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching recent tracks:', error);
    res.status(error.status || 500).json({ error: 'Failed to fetch recent tracks', details: error.body });
  }
});

// Get audio features for tracks
router.get('/audio-features', requireAuth, async (req, res) => {
  const ids = req.query.ids;
  if (!ids) return res.status(400).json({ error: 'Missing ids' });

  const idArray = ids.split(',');
  if (idArray.length > 100) {
    return res.status(400).json({ error: 'Too many track IDs (max 100 allowed)' });
  }

  try {
    const data = await spotifyRequest(req, '/audio-features', {
      params: { ids: idArray.join(',') }
    });
    res.json(data);
  } catch (error) {
    console.error('Error fetching audio features:', error);
    res.status(error.status || 500).json({ error: 'Failed to fetch audio features', details: error.body });
  }
});

// Create playlist
router.post('/create-playlist', requireAuth, async (req, res) => {
  try {
    const { name, description, trackUris } = req.body;

    // Get user ID first
    const userData = await spotifyRequest(req, '/me');
    const userId = userData.id;

    // Create playlist
    const playlistData = await spotifyRequest(req, `/users/${userId}/playlists`, {
      method: 'POST',
      data: {
        name,
        description,
        public: false
      }
    });

    const playlistId = playlistData.id;

    // Add tracks if provided
    if (trackUris && trackUris.length > 0) {
      await spotifyRequest(req, `/playlists/${playlistId}/tracks`, {
        method: 'POST',
        data: { uris: trackUris }
      });
    }

    res.json(playlistData);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(error.status || 500).json({ error: 'Failed to create playlist', details: error.body });
  }
});

export default router;