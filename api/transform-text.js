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
  console.log('API function called');
  console.log('Method:', req.method);
  console.log('Has API key:', !!process.env.MISTRAL_API_KEY);
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('API function called with:', req.body);
    const { text, tone } = req.body;
    
    if (!text?.trim()) {
      console.log('Error: Text is required');
      return res.status(400).json({ error: 'Text is required' });
    }
    
    if (!process.env.MISTRAL_API_KEY) {
      console.log('Error: MISTRAL_API_KEY not found in environment');
      return res.status(500).json({ error: 'Server configuration error: API key missing' });
    }

    const cacheKey = `${text.substring(0, 100)}_${tone.x}_${tone.y}`;
    
    if (cache.has(cacheKey)) {
      return res.status(200).json({ transformedText: cache.get(cacheKey) });
    }

    console.log('Making request to Mistral API...');
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
    console.log('Mistral API response received');

    const transformedText = response.data.choices[0].message.content.trim();
    cache.set(cacheKey, transformedText);
    
    console.log('Returning transformed text');
    return res.status(200).json({ transformedText });
  } catch (error) {
    console.error('API Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    return res.status(500).json({ 
      error: 'Failed to transform text',
      details: error.message 
    });
  }
}