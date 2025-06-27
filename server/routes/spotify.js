import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';

const router = express.Router();

// Initialize Spotify API client
function getSpotifyApi(req) {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:5000/api/auth/callback'
  });
  if (req.session.accessToken) spotifyApi.setAccessToken(req.session.accessToken);
  if (req.session.refreshToken) spotifyApi.setRefreshToken(req.session.refreshToken);
  return spotifyApi;
}

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(req.session.accessToken);
  req.spotifyApi = spotifyApi;
  next();
};

// Get user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const data = await req.spotifyApi.getMe();
    res.json(data.body);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get top tracks with time range
router.get('/top-tracks', requireAuth, async (req, res) => {
  try {
    const { time_range = 'medium_term', limit = 50 } = req.query;
    const data = await req.spotifyApi.getMyTopTracks({
      time_range,
      limit: parseInt(limit)
    });
    res.json(data.body);
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
});

// Get top artists with time range
router.get('/top-artists', requireAuth, async (req, res) => {
  try {
    const { time_range = 'medium_term', limit = 50 } = req.query;
    const data = await req.spotifyApi.getMyTopArtists({
      time_range,
      limit: parseInt(limit)
    });
    res.json(data.body);
  } catch (error) {
    console.error('Error fetching top artists:', error);
    res.status(500).json({ error: 'Failed to fetch top artists' });
  }
});

// Get recently played tracks
router.get('/recent', requireAuth, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const data = await req.spotifyApi.getMyRecentlyPlayedTracks({
      limit: parseInt(limit)
    });
    res.json(data.body);
  } catch (error) {
    console.error('Error fetching recent tracks:', error);
    res.status(500).json({ error: 'Failed to fetch recent tracks' });
  }
});

// Get audio features for tracks
router.get('/audio-features', async (req, res) => {
  const ids = req.query.ids;
  if (!ids) return res.status(400).json({ error: 'Missing ids' });

  const idArray = ids.split(',');
  if (idArray.length > 100) {
    return res.status(400).json({ error: 'Too many track IDs (max 100 allowed)' });
  }

  try {
    const spotifyApi = getSpotifyApi(req);
    if (!req.session.accessToken) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const data = await spotifyApi.getAudioFeaturesForTracks(idArray);
    res.json(data.body);
  } catch (err) {
    console.error('Error fetching audio features:', err.body || err);
    res.status(500).json({ error: 'Failed to fetch audio features', details: err.body || err.message });
  }
});

// Create playlist
router.post('/create-playlist', requireAuth, async (req, res) => {
  try {
    const { name, description, trackUris } = req.body;
    
    // Get user ID first
    const userData = await req.spotifyApi.getMe();
    const userId = userData.body.id;
    
    // Create playlist
    const playlistData = await req.spotifyApi.createPlaylist(userId, {
      name,
      description,
      public: false
    });
    
    const playlistId = playlistData.body.id;
    
    // Add tracks if provided
    if (trackUris && trackUris.length > 0) {
      await req.spotifyApi.addTracksToPlaylist(playlistId, trackUris);
    }
    
    res.json(playlistData.body);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

export default router;