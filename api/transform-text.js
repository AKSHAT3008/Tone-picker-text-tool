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
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 2. Get the text and tone object from the front-end's request
    const { text, tone } = req.body;

    if (!text || typeof tone?.x !== 'number' || typeof tone?.y !== 'number') {
      return res.status(400).json({ error: 'Missing or invalid text or tone in request body' });
    }
    
    if (!process.env.MISTRAL_API_KEY) {
      console.error('API key not configured on server.');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const toneDescription = getToneDescription(tone);

    // 3. Construct a more robust prompt for Mistral
    const prompt = `As an expert editor, rewrite the following text to make it ${toneDescription}. Maintain the core message. Output only the rewritten text, without any introductory phrases, explanations, or markdown formatting.

TEXT:
"""
${text}
"""`;

    // 4. Call the Mistral API from the backend using the built-in fetch API
    const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    // 5. Handle non-successful responses from Mistral
    if (!mistralResponse.ok) {
        const errorData = await mistralResponse.json();
        console.error('Mistral API Error:', errorData);
        // Forward a generic but informative error to the client
        return res.status(mistralResponse.status).json({ error: 'Failed to get a response from the AI service.'});
    }

    const data = await mistralResponse.json();
    const transformedText = data.choices[0]?.message?.content?.trim();
    
    if (!transformedText) {
        throw new Error('Invalid or empty response from Mistral AI');
    }

    // 6. Send the transformed text back to the front-end
    res.status(200).json({ transformedText });

  } catch (error) {
    // This will catch any other errors and log them for debugging
    console.error('Error in /api/transform-text:', error.message);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}