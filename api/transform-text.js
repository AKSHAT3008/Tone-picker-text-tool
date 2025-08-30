import axios from 'axios';

const cache = new Map();

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, tone } = req.body;
    
    if (!text?.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    if (!process.env.MISTRAL_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const cacheKey = `${text.substring(0, 100)}_${tone.x}_${tone.y}`;
    
    if (cache.has(cacheKey)) {
      return res.status(200).json({ transformedText: cache.get(cacheKey) });
    }

    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: `Rewrite this text with ${getToneDescription(tone)} tone: "${text}"` }],
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    
    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Mistral AI');
    }

    const transformedText = response.data.choices[0].message.content.trim();
    cache.set(cacheKey, transformedText);
    
    return res.status(200).json({ transformedText });
  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(500).json({ error: 'Invalid API key' });
    }
    if (error.response?.status === 429) {
      return res.status(500).json({ error: 'Rate limit exceeded' });
    }
    if (error.code === 'ECONNABORTED') {
      return res.status(500).json({ error: 'Request timeout' });
    }
    
    return res.status(500).json({ 
      error: 'Service temporarily unavailable'
    });
  }
}