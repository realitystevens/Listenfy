import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:5000/api/auth/callback'
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
    'user-library-read',
    'playlist-modify-public',
    'playlist-modify-private',
    'playlist-read-private'
  ];
  
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'state');
  res.json({ url: authorizeURL });
});

// Handle Spotify callback
router.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: 'Missing code' });

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    req.session.accessToken = data.body.access_token;
    req.session.refreshToken = data.body.refresh_token;
    req.session.save(() => {
      res.redirect(process.env.NODE_ENV === 'production' ? '/' : 'http://127.0.0.1:5173/');
    });
  } catch (err) {
    console.error('Failed to authenticate:', err.body || err);
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