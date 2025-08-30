export default function handler(req, res) {
  return res.status(200).json({
    message: 'API is working',
    hasApiKey: !!process.env.MISTRAL_API_KEY,
    method: req.method,
    timestamp: new Date().toISOString()
  });
}