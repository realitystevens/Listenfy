import express from 'express';

const router = express.Router();

// Mood analysis based on audio features
const analyzeMood = (audioFeatures) => {
  if (!audioFeatures || audioFeatures.length === 0) {
    return { mood: 'neutral', confidence: 0, features: {} };
  }

  // Calculate average features
  const avgFeatures = audioFeatures.reduce((acc, track) => {
    if (!track) return acc;
    
    acc.valence += track.valence || 0;
    acc.energy += track.energy || 0;
    acc.danceability += track.danceability || 0;
    acc.acousticness += track.acousticness || 0;
    acc.instrumentalness += track.instrumentalness || 0;
    acc.liveness += track.liveness || 0;
    acc.speechiness += track.speechiness || 0;
    acc.tempo += track.tempo || 0;
    acc.count++;
    return acc;
  }, {
    valence: 0, energy: 0, danceability: 0, acousticness: 0,
    instrumentalness: 0, liveness: 0, speechiness: 0, tempo: 0, count: 0
  });

  const count = avgFeatures.count;
  if (count === 0) return { mood: 'neutral', confidence: 0, features: {} };

  // Normalize averages
  Object.keys(avgFeatures).forEach(key => {
    if (key !== 'count' && key !== 'tempo') {
      avgFeatures[key] /= count;
    }
  });
  avgFeatures.tempo = avgFeatures.tempo / count;

  // Determine mood based on valence and energy
  let mood, confidence, advice, encouragement;
  
  if (avgFeatures.valence > 0.6 && avgFeatures.energy > 0.6) {
    mood = 'euphoric';
    confidence = 0.9;
    encouragement = "You're radiating incredible positive energy! Your music choices show you're in an amazing headspace. Keep riding this wave of joy!";
  } else if (avgFeatures.valence > 0.5 && avgFeatures.energy > 0.5) {
    mood = 'happy';
    confidence = 0.8;
    encouragement = "Your mood is bright and uplifting! You're choosing music that reflects a positive outlook. This energy is contagious - spread it around!";
  } else if (avgFeatures.valence > 0.4 && avgFeatures.energy > 0.4) {
    mood = 'content';
    confidence = 0.7;
    encouragement = "You seem to be in a peaceful, balanced state. Your music reflects contentment and stability. This is a wonderful foundation for growth!";
  } else if (avgFeatures.valence < 0.3 && avgFeatures.energy < 0.4) {
    mood = 'melancholic';
    confidence = 0.8;
    advice = "Your music suggests you might be going through a tough time. It's okay to feel this way - emotions are valid. Consider reaching out to someone you trust, or try some uplifting activities.";
  } else if (avgFeatures.valence < 0.4 && avgFeatures.energy < 0.3) {
    mood = 'sad';
    confidence = 0.85;
    advice = "Your recent listening patterns indicate you may be feeling down. Remember that difficult emotions are temporary. Consider talking to a friend, going for a walk, or engaging in self-care activities.";
  } else if (avgFeatures.energy > 0.7 && avgFeatures.valence < 0.5) {
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

const generateInsights = (features, mood) => {
  const insights = [];

  if (features.danceability > 0.7) {
    insights.push("You're drawn to highly danceable music - you might be feeling energetic and ready to move!");
  } else if (features.danceability < 0.3) {
    insights.push("Your recent tracks are less danceable - you might prefer more contemplative or relaxing music right now.");
  }

  if (features.acousticness > 0.6) {
    insights.push("You're gravitating toward acoustic music, suggesting a desire for authenticity and raw emotion.");
  }

  if (features.instrumentalness > 0.5) {
    insights.push("You're choosing more instrumental music - perhaps seeking focus, relaxation, or emotional processing without words.");
  }

  if (features.tempo > 140) {
    insights.push("Your music tempo is quite high - you might be feeling energetic or need motivation!");
  } else if (features.tempo < 90) {
    insights.push("You're preferring slower-paced music, which might indicate a need for calm and reflection.");
  }

  return insights;
};

// Analyze user's mood based on listening history
router.post('/analyze', async (req, res) => {
  try {
    const { audioFeatures, timeRange } = req.body;
    
    if (!audioFeatures) {
      return res.status(400).json({ error: 'Audio features required' });
    }

    const analysis = analyzeMood(audioFeatures);
    
    res.json({
      ...analysis,
      timeRange,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error analyzing mood:', error);
    res.status(500).json({ error: 'Failed to analyze mood' });
  }
});

// Get mood trends over time
router.get('/trends', async (req, res) => {
  try {
    // This would typically fetch from a database
    // For now, return mock trend data
    const trends = [
      { date: '2024-01-01', mood: 'happy', confidence: 0.8 },
      { date: '2024-01-02', mood: 'content', confidence: 0.7 },
      { date: '2024-01-03', mood: 'euphoric', confidence: 0.9 },
      { date: '2024-01-04', mood: 'melancholic', confidence: 0.6 },
      { date: '2024-01-05', mood: 'happy', confidence: 0.85 }
    ];
    
    res.json(trends);
  } catch (error) {
    console.error('Error fetching mood trends:', error);
    res.status(500).json({ error: 'Failed to fetch mood trends' });
  }
});

export default router;