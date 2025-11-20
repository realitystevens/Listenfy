import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock trend data - in production, you'd fetch this from a database
    const trends = [
      { date: '2024-11-15', mood: 'happy', confidence: 0.8 },
      { date: '2024-11-16', mood: 'content', confidence: 0.7 },
      { date: '2024-11-17', mood: 'euphoric', confidence: 0.9 },
      { date: '2024-11-18', mood: 'melancholic', confidence: 0.6 },
      { date: '2024-11-19', mood: 'happy', confidence: 0.85 },
      { date: '2024-11-20', mood: 'content', confidence: 0.75 }
    ];
    
    return NextResponse.json(trends);
  } catch (error) {
    console.error('Error fetching mood trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mood trends' },
      { status: 500 }
    );
  }
}
