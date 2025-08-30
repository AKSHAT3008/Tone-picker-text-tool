# Tone Picker Text Tool

Transform text tone using AI-powered adjustments. Built with React, TypeScript, Express.js backend, and Mistral AI API.

## Quick Start

### Prerequisites
- Node.js 14+
- Mistral AI API key

### Setup
1. **Clone and install**
```bash
git clone <repository-url>
cd tone-picker-text-tool

# Install frontend
cd tone-picker-text-tool
npm install

# Install backend
cd ../backend
npm install
```

2. **Configure API key**
```bash
cd backend
cp .env.example .env
# Edit .env and add: MISTRAL_API_KEY=your_key_here
```

3. **Run the application**
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd tone-picker-text-tool
npm start
```

4. **Access the app**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Features

### Core Functionality
- **Text Editor**: Input text with live character/word count
- **3x3 Tone Matrix**: Adjust tone from formal/casual and professional/friendly
- **Undo/Redo**: Complete revision history navigation
- **Reset**: Return to original text
- **Auto-save**: Persistent storage across sessions

### Technical Implementation
- **Secure Backend**: API key protection via Express.js server
- **Smart Caching**: Dual-layer caching (client + server)
- **Error Handling**: Graceful failures with retry options
- **TypeScript**: Full type safety
- **Responsive Design**: Works on all devices
- **Accessibility**: WCAG 2.1 AA compliant

## Usage

1. Enter text in the left editor
2. Click any position on the 3x3 tone grid
3. AI transforms your text to match the selected tone
4. Use Undo/Redo to navigate changes
5. Reset returns to original text

### Tone Grid Layout
```
Formal Professional  |  Neutral Professional  |  Casual Professional
Formal Neutral       |  Neutral Neutral       |  Casual Neutral  
Formal Friendly      |  Neutral Friendly      |  Casual Friendly
```

## Architecture

### Project Structure
```
├── tone-picker-text-tool/    # React frontend
│   ├── src/components/       # UI components
│   ├── src/services/         # API integration
│   └── src/types/           # TypeScript definitions
└── backend/                 # Express.js API
    ├── server.js           # Main server
    ├── .env               # API key (create from .env.example)
    └── package.json       # Dependencies
```

### API Flow
1. Frontend → Backend API (`/api/transform-text`)
2. Backend → Mistral AI API (with caching)
3. Response → Frontend with transformed text

## Development

### Available Scripts
**Frontend:**
- `npm start` - Development server
- `npm build` - Production build
- `npm test` - Run tests

**Backend:**
- `npm start` - Start server
- `npm run dev` - Development with auto-reload

### Environment Variables
```bash
# backend/.env
MISTRAL_API_KEY=your_mistral_api_key
PORT=3001
```

## Troubleshooting

### Common Issues
1. **"Cannot connect to server"**
   - Ensure backend is running on port 3001
   - Check .env file has valid API key

2. **"API key invalid"**
   - Verify Mistral AI API key in backend/.env
   - Check API key permissions

3. **Port conflicts**
   - Frontend: Change port with `PORT=3001 npm start`
   - Backend: Update PORT in .env file

### Debug Mode
```javascript
// Browser console
localStorage.setItem('debug', 'true');
```

## Accessibility

- **Screen Reader**: Full NVDA/JAWS/VoiceOver support
- **Keyboard Navigation**: Tab through all controls
- **ARIA Labels**: Comprehensive semantic markup
- **Focus Indicators**: High-contrast visual feedback

Test with:
- Tab navigation only
- Screen reader software
- Browser accessibility tools (F12 → Accessibility)

## Technical Details

### Security
- API key stored securely in backend environment
- CORS configured for frontend-backend communication
- No sensitive data exposed to client

### Performance
- Server-side response caching
- Client-side request deduplication
- Optimized React rendering with hooks

### Browser Support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile responsive design
- Progressive enhancement

## License

MIT License