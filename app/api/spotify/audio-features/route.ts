import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

async function spotifyRequest(endpoint: string, options: RequestInit = {}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('spotify_access_token');

  if (!accessToken?.value) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken.value}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || 'Spotify API request failed');
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ids = searchParams.get('ids');

    if (!ids) {
      return NextResponse.json({ error: 'Missing ids parameter' }, { status: 400 });
    }

    const idArray = ids.split(',');
    if (idArray.length > 100) {
      return NextResponse.json({ error: 'Too many track IDs (max 100)' }, { status: 400 });
    }

    const data = await spotifyRequest(`/audio-features?ids=${ids}`);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching audio features:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audio features' },
      { status: error.message === 'Not authenticated' ? 401 : 500 }
    );
  }
}
