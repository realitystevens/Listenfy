const express = require('express');
const querystring = require('querystring');
const axios = require('axios');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const PORT = 5000;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = 'http://127.0.0.1:5000/callback';

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(session({ 
  secret: process.env.SESSION_SECRET_KEY, 
  resave: false, 
  saveUninitialized: true 
}));

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', function(req, res) {
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email user-top-read';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state
    }));
});

app.get('/callback', async function(req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect('/?' + querystring.stringify({ error: 'state_mismatch' }));
  } else {
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token',
        querystring.stringify({
          code,
          redirect_uri,
          grant_type: 'authorization_code'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
          }
        });

      req.session.access_token = response.data.access_token;
      req.session.refresh_token = response.data.refresh_token;
      res.redirect('/dashboard');
    } catch (error) {
      res.json({ error: 'Failed to get token', details: error.response ? error.response.data : error.message });
    }
  }
});

app.get('/dashboard', async (req, res) => {
  const token = req.session.access_token;
  if (!token) return res.redirect('/');

  try {
    const { data } = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=10', {
      headers: { Authorization: 'Bearer ' + token }
    });

    const artistNames = data.items.map(artist => artist.name);
    const genres = {};
    data.items.forEach(artist => {
      artist.genres.forEach(genre => {
        genres[genre] = (genres[genre] || 0) + 1;
      });
    });

    const sortedGenres = Object.entries(genres)
      .sort((a, b) => b[1] - a[1])
      .map(g => g[0]);

    let mood = 'Reflective';
    let summary = 'Your recent music taste seems deep and meaningful.';

    if (sortedGenres.some(g => g.includes('gospel') || g.includes('christian') || g.includes('chant'))) {
      mood = 'Spiritual';
      summary = 'You have been in a meditative and spiritual space. Keep it up.';
    } else if (sortedGenres.some(g => g.includes('sad') || g.includes('melancholy'))) {
      mood = 'Emotional';
      summary = 'Your music suggests you might be feeling a little down. Be kind to yourself.';
    }

    res.render('dashboard', { mood, summary, artists: artistNames, genres: sortedGenres });

  } catch (err) {
    console.error(err);
    res.send('Failed to load dashboard');
  }
});



app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});