import React from 'react';
import './TextEditor.css';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter your text here...",
  disabled = false,
  loading = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const characterCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="text-editor" role="region" aria-labelledby="text-editor-heading">
      <div className="editor-header">
        <h3 id="text-editor-heading">Text Editor</h3>
        <div className="text-stats" aria-live="polite" aria-label="Text statistics">
          <span className="stat" aria-label={`${characterCount} characters`}>
            {characterCount} characters
          </span>
          <span className="stat" aria-label={`${wordCount} words`}>
            {wordCount} words
          </span>
        </div>
      </div>
      
      <div className="textarea-container">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled || loading}
          className={`text-input ${loading ? 'loading' : ''}`}
          rows={12}
          aria-label="Enter your text for tone transformation"
          aria-describedby="text-stats"
        />
        {loading && (
          <div className="loading-overlay" role="status" aria-live="assertive">
            <div className="loading-spinner" aria-hidden="true"></div>
            <span>Transforming text...</span>
          </div>
        )}
      </div>
      
      {disabled && !loading && (
        <div className="disabled-message" role="status">
          Please enter some text to start editing
        </div>
      )}
    </div>
  );
};

export default TextEditor;
