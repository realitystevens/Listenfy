import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI = 'http://127.0.0.1:3000/api/auth/callback'
} = process.env;

export async function GET(request: NextRequest) {
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
    client_id: SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: scopes.join(' '),
    state: 'state'
  });

  const authorizeURL = `https://accounts.spotify.com/authorize?${params.toString()}`;
  
  return NextResponse.json({ url: authorizeURL });
}
