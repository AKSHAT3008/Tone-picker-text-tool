import React, { useState, useEffect, useCallback } from 'react';
import TextEditor from './components/TextEditor';
import TonePicker from './components/TonePicker';
import ErrorMessage from './components/ErrorMessage';
import ScreenReaderAnnouncer from './components/ScreenReaderAnnouncer';
import { MistralApiService } from './services/mistralApi';
import { TonePosition, TextRevision } from './types';
import './App.css';

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [currentTone, setCurrentTone] = useState<TonePosition>({ x: 0, y: 0 });
  const [revisions, setRevisions] = useState<TextRevision[]>([]);
  const [currentRevisionIndex, setCurrentRevisionIndex] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string>('');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedText = localStorage.getItem('tonePickerText');
    const savedRevisions = localStorage.getItem('tonePickerRevisions');
    const savedCurrentIndex = localStorage.getItem('tonePickerCurrentIndex');

    if (savedText) {
      setText(savedText);
    }
    
    if (savedRevisions) {
      try {
        const parsedRevisions = JSON.parse(savedRevisions);
        setRevisions(parsedRevisions);
        setCurrentRevisionIndex(parsedRevisions.length - 1);
      } catch (e) {
        console.error('Failed to parse saved revisions:', e);
      }
    }
    
    if (savedCurrentIndex) {
      setCurrentRevisionIndex(parseInt(savedCurrentIndex));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tonePickerText', text);
  }, [text]);

  useEffect(() => {
    localStorage.setItem('tonePickerRevisions', JSON.stringify(revisions));
    localStorage.setItem('tonePickerCurrentIndex', currentRevisionIndex.toString());
  }, [revisions, currentRevisionIndex]);

  const addRevision = useCallback((newText: string, tone: TonePosition) => {
    const newRevision: TextRevision = {
      id: Date.now().toString(),
      text: newText,
      tone,
      timestamp: Date.now()
    };

    // Remove any revisions after the current index (for undo/redo)
    const updatedRevisions = revisions.slice(0, currentRevisionIndex + 1);
    updatedRevisions.push(newRevision);

    setRevisions(updatedRevisions);
    setCurrentRevisionIndex(updatedRevisions.length - 1);
  }, [revisions, currentRevisionIndex]);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
    setError(null);
    
    // Add initial revision when user first enters text
    if (newText.trim() && revisions.length === 0) {
      const initialRevision: TextRevision = {
        id: Date.now().toString(),
        text: newText,
        tone: { x: 0, y: 0 },
        timestamp: Date.now()
      };
      setRevisions([initialRevision]);
      setCurrentRevisionIndex(0);
    }
  }, [revisions.length]);

  const handleToneChange = useCallback(async (newTone: TonePosition) => {
    if (!text.trim()) {
      setError('Please enter some text before changing the tone');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const transformedText = await MistralApiService.transformText(text, newTone);
      setText(transformedText);
      addRevision(transformedText, newTone);
      setCurrentTone(newTone);
      setAnnouncement(`Text tone changed to ${getToneDescription(newTone)}`);
    } catch (err: any) {
      setError(err.message || 'Failed to transform text');
      setAnnouncement(`Error: ${err.message || 'Failed to transform text'}`);
      console.error('Tone transformation error:', err);
    } finally {
      setLoading(false);
    }
  }, [text, addRevision]);

  const handleUndo = useCallback(() => {
    if (currentRevisionIndex > 0) {
      const previousRevision = revisions[currentRevisionIndex - 1];
      setText(previousRevision.text);
      setCurrentTone(previousRevision.tone);
      setCurrentRevisionIndex(currentRevisionIndex - 1);
      setError(null);
    }
  }, [currentRevisionIndex, revisions]);

  const handleRedo = useCallback(() => {
    if (currentRevisionIndex < revisions.length - 1) {
      const nextRevision = revisions[currentRevisionIndex + 1];
      setText(nextRevision.text);
      setCurrentTone(nextRevision.tone);
      setCurrentRevisionIndex(currentRevisionIndex + 1);
      setError(null);
    }
  }, [currentRevisionIndex, revisions]);

  const handleReset = useCallback(() => {
    if (revisions.length > 0) {
      const originalRevision = revisions[0];
      setText(originalRevision.text);
      setCurrentTone(originalRevision.tone);
      setCurrentRevisionIndex(0);
      setError(null);
    }
  }, [revisions]);

  const handleRetry = useCallback(() => {
    setError(null);
    handleToneChange(currentTone);
  }, [currentTone, handleToneChange]);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  const getToneDescription = (tone: TonePosition): string => {
    const { x, y } = tone;
    if (x === -1 && y === -1) return 'professional';
    if (x === 0 && y === -1) return 'professional and formal';
    if (x === 1 && y === -1) return 'formal';
    if (x === -1 && y === 0) return 'mixed professional and friendly';
    if (x === 0 && y === 0) return 'neutral';
    if (x === 1 && y === 0) return 'mixed formal and casual';
    if (x === -1 && y === 1) return 'friendly';
    if (x === 0 && y === 1) return 'mixed friendly and casual';
    if (x === 1 && y === 1) return 'casual';
    return 'neutral';
  };

  const canUndo = currentRevisionIndex > 0;
  const canRedo = currentRevisionIndex < revisions.length - 1;
  const canReset = revisions.length > 0;

  return (
    <div className="app">
      <ScreenReaderAnnouncer message={announcement} priority="polite" />
      <header className="app-header">
        <h1>Tone Picker Text Tool</h1>
        <p>Transform your text's tone using AI-powered adjustments</p>
      </header>

      <main className="app-main">
        <div className="controls" role="toolbar" aria-label="Text revision controls">
          <div className="control-buttons">
            <button
              className={`control-button ${canUndo ? '' : 'disabled'}`}
              onClick={handleUndo}
              disabled={!canUndo}
              title="Undo last tone change"
              aria-label={`Undo last tone change${!canUndo ? ' (no previous revisions)' : ''}`}
            >
              ↩️ Undo
            </button>
            <button
              className={`control-button ${canRedo ? '' : 'disabled'}`}
              onClick={handleRedo}
              disabled={!canRedo}
              title="Redo tone change"
              aria-label={`Redo tone change${!canRedo ? ' (no future revisions)' : ''}`}
            >
              ↪️ Redo
            </button>
            <button
              className={`control-button ${canReset ? '' : 'disabled'}`}
              onClick={handleReset}
              disabled={!canReset}
              title="Reset to original text"
              aria-label={`Reset to original text${!canReset ? ' (no revisions available)' : ''}`}
            >
              🔄 Reset
            </button>
          </div>
          
          {revisions.length > 0 && (
            <div className="revision-info">
              <span>Revision {currentRevisionIndex + 1} of {revisions.length}</span>
            </div>
          )}
        </div>

        {error && (
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
            onDismiss={handleDismissError}
          />
        )}

        <div className="content">
          <TextEditor
            value={text}
            onChange={handleTextChange}
            loading={loading}
            disabled={false}
          />
          
          <TonePicker
            currentTone={currentTone}
            onToneChange={handleToneChange}
            disabled={loading}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>Powered by Mistral AI • Built with React</p>
      </footer>
    </div>
  );
};

export default App;
