import { NextRequest, NextResponse } from 'next/server';

interface AudioFeature {
  valence?: number;
  energy?: number;
  danceability?: number;
  acousticness?: number;
  instrumentalness?: number;
  liveness?: number;
  speechiness?: number;
  tempo?: number;
}

interface AvgFeatures extends AudioFeature {
  count: number;
}

const analyzeMood = (audioFeatures: (AudioFeature | null)[]) => {
  if (!audioFeatures || audioFeatures.length === 0) {
    return { mood: 'neutral', confidence: 0, features: {} };
  }

  // Calculate average features
  const avgFeatures: AvgFeatures = audioFeatures.reduce((acc: AvgFeatures, track) => {
    if (!track) return acc;
    
    acc.valence = (acc.valence || 0) + (track.valence || 0);
    acc.energy = (acc.energy || 0) + (track.energy || 0);
    acc.danceability = (acc.danceability || 0) + (track.danceability || 0);
    acc.acousticness = (acc.acousticness || 0) + (track.acousticness || 0);
    acc.instrumentalness = (acc.instrumentalness || 0) + (track.instrumentalness || 0);
    acc.liveness = (acc.liveness || 0) + (track.liveness || 0);
    acc.speechiness = (acc.speechiness || 0) + (track.speechiness || 0);
    acc.tempo = (acc.tempo || 0) + (track.tempo || 0);
    acc.count++;
    
    return acc;
  }, { count: 0 } as AvgFeatures);

  const count = avgFeatures.count;
  if (count === 0) return { mood: 'neutral', confidence: 0, features: {} };

  // Normalize averages
  Object.keys(avgFeatures).forEach(key => {
    if (key !== 'count' && key !== 'tempo') {
      avgFeatures[key as keyof AudioFeature] = (avgFeatures[key as keyof AudioFeature] || 0) / count;
    }
  });
  avgFeatures.tempo = (avgFeatures.tempo || 0) / count;

  // Determine mood based on valence and energy
  let mood, confidence, advice, encouragement;
  const valence = avgFeatures.valence || 0;
  const energy = avgFeatures.energy || 0;
  
  if (valence > 0.6 && energy > 0.6) {
    mood = 'euphoric';
    confidence = 0.9;
    encouragement = "You're radiating incredible positive energy! Your music choices show you're in an amazing headspace. Keep riding this wave of joy!";
  } else if (valence > 0.5 && energy > 0.5) {
    mood = 'happy';
    confidence = 0.8;
    encouragement = "Your mood is bright and uplifting! You're choosing music that reflects a positive outlook. This energy is contagious - spread it around!";
  } else if (valence > 0.4 && energy > 0.4) {
    mood = 'content';
    confidence = 0.7;
    encouragement = "You seem to be in a peaceful, balanced state. Your music reflects contentment and stability. This is a wonderful foundation for growth!";
  } else if (valence < 0.3 && energy < 0.4) {
    mood = 'melancholic';
    confidence = 0.8;
    advice = "Your music suggests you might be going through a tough time. It's okay to feel this way - emotions are valid. Consider reaching out to someone you trust, or try some uplifting activities.";
  } else if (valence < 0.4 && energy < 0.3) {
    mood = 'sad';
    confidence = 0.85;
    advice = "Your recent listening patterns indicate you may be feeling down. Remember that difficult emotions are temporary. Consider talking to a friend, going for a walk, or engaging in self-care activities. If these feelings persist, professional support can be very helpful.";
  } else if (energy > 0.7 && valence < 0.5) {
    mood = 'aggressive';
    confidence = 0.75;
    advice = "Your music choices suggest high energy but possibly some frustration. Channel this energy positively - maybe through exercise, creative expression, or problem-solving.";
  } else {
    mood = 'neutral';
    confidence = 0.6;
    encouragement = "Your mood seems balanced and stable. You're in a good position to make positive changes or tackle new challenges!";
  }

  // Generate detailed insights
  const insights = generateInsights(avgFeatures, mood);

  return {
    mood,
    confidence,
    features: avgFeatures,
    advice,
    encouragement,
    insights
  };
};

const generateInsights = (features: AvgFeatures, mood: string): string[] => {
  const insights: string[] = [];
  const danceability = features.danceability || 0;
  const acousticness = features.acousticness || 0;
  const instrumentalness = features.instrumentalness || 0;
  const tempo = features.tempo || 0;

  if (danceability > 0.7) {
    insights.push("You're drawn to highly danceable music - you might be feeling energetic and ready to move!");
  } else if (danceability < 0.3) {
    insights.push("Your recent tracks are less danceable - you might prefer more contemplative or relaxing music right now.");
  }

  if (acousticness > 0.6) {
    insights.push("You're gravitating toward acoustic music, suggesting a desire for authenticity and raw emotion.");
  }

  if (instrumentalness > 0.5) {
    insights.push("You're choosing more instrumental music - perhaps seeking focus, relaxation, or emotional processing without words.");
  }

  if (tempo > 140) {
    insights.push("Your music tempo is quite high - you might be feeling energetic or need motivation!");
  } else if (tempo < 90) {
    insights.push("You're preferring slower-paced music, which might indicate a need for calm and reflection.");
  }

  return insights;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { audioFeatures, timeRange } = body;
    
    if (!audioFeatures) {
      return NextResponse.json({ error: 'Audio features required' }, { status: 400 });
    }

    const analysis = analyzeMood(audioFeatures);
    
    return NextResponse.json({
      ...analysis,
      timeRange,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error analyzing mood:', error);
    return NextResponse.json(
      { error: 'Failed to analyze mood' },
      { status: 500 }
    );
  }
}
