const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Tone Picker API is running' });
});

const cache = new Map();

app.post('/api/transform-text', async (req, res) => {
  try {
    const { text, tone } = req.body;
    
    if (!text?.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const cacheKey = `${text.substring(0, 100)}_${tone.x}_${tone.y}`;
    
    if (cache.has(cacheKey)) {
      return res.json({ transformedText: cache.get(cacheKey) });
    }

    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: `Rewrite this text with ${getToneDescription(tone)} tone: "${text}"` }],
        max_tokens: 1000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const transformedText = response.data.choices[0].message.content.trim();
    cache.set(cacheKey, transformedText);
    
    res.json({ transformedText });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to transform text' });
  }
});

function getToneDescription(tone) {
  const { x, y } = tone;
  if (x === -1 && y === -1) return 'professional and direct';
  if (x === 0 && y === -1) return 'professional and formal';
  if (x === 1 && y === -1) return 'formal and structured';
  if (x === -1 && y === 0) return 'balanced professional and friendly';
  if (x === 0 && y === 0) return 'neutral and balanced';
  if (x === 1 && y === 0) return 'balanced formal and casual';
  if (x === -1 && y === 1) return 'friendly and approachable';
  if (x === 0 && y === 1) return 'balanced friendly and casual';
  if (x === 1 && y === 1) return 'casual and relaxed';
  return 'neutral and balanced';
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});