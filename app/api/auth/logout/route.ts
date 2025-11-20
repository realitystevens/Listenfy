import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  
  // Delete authentication cookies
  cookieStore.delete('spotify_access_token');
  cookieStore.delete('spotify_refresh_token');
  
  return NextResponse.json({ success: true });
}
