import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize Gemini AI client only if API key is available
let genAI = null;
let model = null;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key') {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

const THERAPY_PROMPT = `You are a compassionate and professional AI therapy assistant integrated into Listenify, a music mood analysis app. Your role is to:

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

// Chat with AI therapist
router.post('/message', async (req, res) => {
  try {
    if (!model) {
      return res.status(503).json({ 
        error: 'AI chat service is currently unavailable. Please configure the Gemini API key.' 
      });
    }

    const { message, moodContext, conversationHistory = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
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
      recentHistory.forEach(msg => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        contextPrompt += `${role}: ${msg.content}\n`;
      });
      contextPrompt += '\n';
    }

    // Add current message
    contextPrompt += `User: ${message}\n\nAssistant:`;

    const result = await model.generateContent(contextPrompt);
    const response = result.response.text();

    res.json({
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Generate playlist recommendations based on mood and chat context
router.post('/playlist-recommendation', async (req, res) => {
  try {
    if (!model) {
      return res.status(503).json({ 
        error: 'AI playlist recommendation service is currently unavailable. Please configure the Gemini API key.' 
      });
    }

    const { currentMood, desiredMood, context } = req.body;
    
    const prompt = `Based on the user's current mood (${currentMood}) and desired mood (${desiredMood}), suggest a therapeutic playlist. Context: ${context || 'No additional context'}. 

Provide:
1. A playlist name
2. Brief description (2-3 sentences)
3. 8-12 specific song suggestions with artist names
4. Explanation of how this playlist supports their emotional journey

Format your response as a JSON object with the following structure:
{
  "name": "playlist name",
  "description": "brief description",
  "songs": [
    {"title": "song title", "artist": "artist name"},
    ...
  ],
  "rationale": "explanation of how this playlist helps"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const recommendation = JSON.parse(jsonMatch[0]);
        res.json(recommendation);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // If JSON parsing fails, return structured response with raw text
      res.json({
        name: "Personalized Mood Playlist",
        description: responseText.substring(0, 200) + "...",
        songs: [],
        rationale: "AI-generated recommendation based on your current emotional state."
      });
    }

  } catch (error) {
    console.error('Error generating playlist recommendation:', error);
    res.status(500).json({ error: 'Failed to generate playlist recommendation' });
  }
});

export default router;