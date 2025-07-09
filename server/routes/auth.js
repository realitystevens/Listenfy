import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI = 'http://127.0.0.1:5000/api/auth/callback'
} = process.env;

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
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: scopes.join(' '),
    state: 'state'
  });
  const authorizeURL = `https://accounts.spotify.com/authorize?${params.toString()}`;
  res.json({ url: authorizeURL });
});

// Handle Spotify callback
router.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: 'Missing code' });

  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      client_id: SPOTIFY_CLIENT_ID,
      client_secret: SPOTIFY_CLIENT_SECRET
    });

    const response = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    req.session.accessToken = response.data.access_token;
    req.session.refreshToken = response.data.refresh_token;
    req.session.save(() => {
      res.redirect(process.env.NODE_ENV === 'production' ? '/' : 'http://127.0.0.1:5173/');
    });
  } catch (err) {
    console.error('Failed to authenticate:', err.response?.data || err.message);
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