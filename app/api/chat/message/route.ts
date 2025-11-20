import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const THERAPY_PROMPT = `You are a compassionate and professional AI therapy assistant integrated into Listenfy, a music mood analysis app. Your role is to:

1. Provide supportive, empathetic responses based on the user's mood and music listening patterns
2. Offer practical advice for mental wellness
3. Suggest specific music or playlists that could help improve the user's mood
4. Use music therapy principles when appropriate
5. Maintain professional boundaries while being warm and approachable
6. Never provide medical diagnoses or replace professional therapy

Guidelines:
- Be empathetic and non-judgmental
- Ask thoughtful follow-up questions
- Validate the user's feelings
- Suggest practical coping strategies
- Incorporate music-based recommendations
- Encourage professional help when appropriate
- Keep responses concise but meaningful (2-3 paragraphs max)

Remember: You're here to support and guide, not to diagnose or replace professional mental health care.`;

export async function POST(request: NextRequest) {
  try {
    const { GEMINI_API_KEY } = process.env;
    
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI chat service is currently unavailable. Please configure the Gemini API key.' },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const body = await request.json();
    const { message, moodContext, conversationHistory = [] } = body;
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build conversation context
    let contextPrompt = THERAPY_PROMPT + '\n\n';

    // Add mood context if available
    if (moodContext) {
      contextPrompt += `Current user mood analysis: ${moodContext.mood} (confidence: ${Math.round(moodContext.confidence * 100)}%). Recent insights: ${moodContext.insights?.join('. ') || 'No specific insights available.'} ${moodContext.advice || moodContext.encouragement || ''}\n\n`;
    }

    // Add conversation history (last 6 messages to maintain context)
    const recentHistory = conversationHistory.slice(-6);
    if (recentHistory.length > 0) {
      contextPrompt += 'Previous conversation:\n';
      recentHistory.forEach((msg: any) => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        contextPrompt += `${role}: ${msg.content}\n`;
      });
      contextPrompt += '\n';
    }

    // Add current message
    contextPrompt += `User: ${message}\n\nAssistant:`;

    const result = await model.generateContent(contextPrompt);
    const response = result.response.text();

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
