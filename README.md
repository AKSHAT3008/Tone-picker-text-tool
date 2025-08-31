# Tone Picker Text Tool

Transform text tone using AI-powered adjustments. Built with React, TypeScript, and Mistral AI API. Deployed as a full-stack application on Vercel.

## 🚀 Live Demo

**[View Live Application](https://tone-picker-text-tool-psi.vercel.app/)**

## ✨ Features

### Core Functionality
- **Text Editor**: Input text with live character/word count
- **3x3 Tone Matrix**: Adjust tone from formal/casual and professional/friendly
- **Undo/Redo**: Complete revision history navigation
- **Reset**: Return to original text
- **Auto-save**: Persistent storage across sessions

### Technical Implementation
- **AI Integration**: Powered by Mistral AI's small model
- **Serverless Backend**: Vercel serverless functions for API security
- **Error Handling**: Graceful failures with user-friendly messages
- **TypeScript**: Full type safety throughout
- **Responsive Design**: Works on all devices
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support

## 🎯 Usage

1. **Enter text** in the editor on the left
2. **Click any position** on the 3x3 tone grid on the right
3. **AI transforms** your text to match the selected tone
4. **Navigate history** with Undo/Redo buttons
5. **Reset** returns to original text

### Tone Grid Layout
```
Professional & Direct  |  Professional & Formal  |  Formal & Structured
Balanced Pro/Friendly  |  Neutral & Balanced     |  Balanced Form/Casual
Friendly & Approachable|  Balanced Friend/Casual |  Casual & Relaxed
```

## 🛠️ Local Development

### Prerequisites
- Node.js 14+
- Mistral AI API key

### Setup
```bash
# Clone repository
git clone https://github.com/AKSHAT3008/Tone-picker-text-tool.git
cd Tone-picker-text-tool

# Install frontend dependencies
cd tone-picker-text-tool
npm install

# Install backend dependencies  
cd ../backend
npm install
cp .env.example .env
# Edit .env and add your MISTRAL_API_KEY
```

### Run Locally
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd tone-picker-text-tool
npm start
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🏗️ Architecture

### Project Structure
```
├── tone-picker-text-tool/    # React frontend
│   ├── src/components/       # UI components
│   ├── src/services/         # API integration
│   └── src/types/           # TypeScript definitions
├── backend/                 # Express.js server (local dev)
├── api/                     # Vercel serverless functions
└── vercel.json             # Deployment configuration
```

### Technology Stack
- **Frontend**: React 19, TypeScript, CSS3
- **Backend**: Vercel Serverless Functions
- **AI**: Mistral AI API (mistral-small-latest)
- **Deployment**: Vercel
- **Storage**: Browser localStorage

## 🚀 Deployment

### Vercel Deployment
1. **Fork/Clone** this repository
2. **Connect to Vercel**: Import project from GitHub
3. **Add Environment Variable**: 
   - Key: `MISTRAL_API_KEY`
   - Value: Your Mistral AI API key
4. **Deploy**: Automatic deployment on git push

### Environment Variables
```bash
# Required for production
MISTRAL_API_KEY=your_mistral_api_key_here
```

## 🧪 Testing

Comprehensive test cases available in `TEST_CASES.md`:
- Basic functionality (9 tone transformations)
- Edge cases (special characters, long text)
- Error handling (network issues, API failures)
- Accessibility (keyboard navigation, screen readers)
- Performance (large text, memory usage)

## 🎨 Accessibility Features

- **Screen Reader Support**: Full NVDA/JAWS/VoiceOver compatibility
- **Keyboard Navigation**: Complete functionality without mouse
- **ARIA Labels**: Comprehensive semantic markup
- **Focus Management**: High-contrast visual indicators
- **Live Announcements**: Real-time feedback for tone changes

## 🔧 API Reference

### Transform Text Endpoint
```
POST /api/transform-text
Content-Type: application/json

{
  "text": "Your text here",
  "tone": { "x": 0, "y": 0 }
}

Response:
{
  "transformedText": "Transformed text here"
}
```

### Tone Coordinates
- **x-axis**: -1 (Professional) → 0 (Neutral) → 1 (Casual)
- **y-axis**: -1 (Direct) → 0 (Balanced) → 1 (Friendly)

## 🐛 Troubleshooting

### Common Issues
1. **"Failed to transform text"**: Check internet connection and API key
2. **Blank page**: Check browser console for JavaScript errors
3. **Slow responses**: Large text may take longer to process

### Debug Mode
```javascript
// Browser console
localStorage.setItem('debug', 'true');
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📊 Performance

- **Response Time**: < 3 seconds for typical text
- **Supported Text Length**: Up to 5000 characters
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support**: iOS 14+, Android 8+

## 🔒 Security

- API key stored securely in serverless environment
- Input sanitization prevents XSS attacks
- No sensitive data stored in browser
- HTTPS encryption for all communications

---

**Built with ❤️ using React, TypeScript, and Mistral AI**