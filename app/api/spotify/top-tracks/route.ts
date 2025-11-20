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
    const timeRange = searchParams.get('time_range') || 'medium_term';
    const limit = searchParams.get('limit') || '50';

    const data = await spotifyRequest(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching top tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top tracks' },
      { status: error.message === 'Not authenticated' ? 401 : 500 }
    );
  }
}
