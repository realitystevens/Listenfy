import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI = 'http://127.0.0.1:3000/api/auth/callback',
  NODE_ENV
} = process.env;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', request.url));
  }

  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      client_id: SPOTIFY_CLIENT_ID!,
      client_secret: SPOTIFY_CLIENT_SECRET!
    });

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();

    // Set cookies for access token and refresh token
    const cookieStore = cookies();
    cookieStore.set('spotify_access_token', data.access_token, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 // 1 hour
    });

    if (data.refresh_token) {
      cookieStore.set('spotify_refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });
    }

    // Redirect to dashboard
    const redirectUrl = NODE_ENV === 'production' 
      ? new URL('/dashboard', request.url)
      : new URL('http://127.0.0.1:3000/dashboard');
    
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}
