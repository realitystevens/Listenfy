import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';

const router = express.Router();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:5000/api/auth/callback'
});

// Generate Spotify authorization URL
router.get('/login', (req, res) => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-read-currently-playing',
    'playlist-modify-public',
    'playlist-modify-private'
  ];
  
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'state');
  res.json({ url: authorizeURL });
});

// Handle Spotify callback
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;
    
    // Store tokens in session
    req.session.accessToken = access_token;
    req.session.refreshToken = refresh_token;
    req.session.expiresIn = expires_in;
    
    // Redirect to frontend
    res.redirect(process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5173/');
    
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(400).json({ error: 'Failed to authenticate' });
  }
});

// Check auth status
router.get('/status', (req, res) => {
  const isAuthenticated = !!req.session.accessToken;
  res.json({ isAuthenticated });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

export default router;