import React from 'react';
import { TonePosition } from '../types';
import './TonePicker.css';

interface TonePickerProps {
  currentTone: TonePosition;
  onToneChange: (tone: TonePosition) => void;
  disabled?: boolean;
}

const TonePicker: React.FC<TonePickerProps> = ({ 
  currentTone, 
  onToneChange, 
  disabled = false 
}) => {
  // Define the 9 positions for a complete 3x3 interactive grid
  const positions = [
    // Row 1
    { x: -1, y: -1, label: 'Professional', position: 'top-left' },
    { x: 0, y: -1, label: 'Professional & Formal', position: 'top-center' },
    { x: 1, y: -1, label: 'Formal', position: 'top-right' },
    // Row 2
    { x: -1, y: 0, label: 'Mixed Professional & Friendly', position: 'middle-left' },
    { x: 0, y: 0, label: 'Neutral', position: 'center' },
    { x: 1, y: 0, label: 'Mixed Formal & Casual', position: 'middle-right' },
    // Row 3
    { x: -1, y: 1, label: 'Friendly', position: 'bottom-left' },
    { x: 0, y: 1, label: 'Mixed Friendly & Casual', position: 'bottom-center' },
    { x: 1, y: 1, label: 'Casual', position: 'bottom-right' },
  ];

  const handlePositionClick = (x: number, y: number) => {
    if (!disabled) {
      onToneChange({ x, y });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, x: number, y: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePositionClick(x, y);
    }
  };

  const isSelected = (x: number, y: number) => {
    return currentTone.x === x && currentTone.y === y;
  };

  const getPositionLabel = (position: string) => {
    switch (position) {
      case 'top-left': return 'Professional';
      case 'top-center': return 'Professional & Formal';
      case 'top-right': return 'Formal';
      case 'middle-left': return 'Mixed Professional & Friendly';
      case 'center': return 'Neutral';
      case 'middle-right': return 'Mixed Formal & Casual';
      case 'bottom-left': return 'Friendly';
      case 'bottom-center': return 'Mixed Friendly & Casual';
      case 'bottom-right': return 'Casual';
      default: return '';
    }
  };

  return (
    <div className="tone-picker" role="region" aria-labelledby="tone-picker-heading">
      <h3 id="tone-picker-heading">Tone Picker</h3>
      <div 
        className="tone-grid" 
        role="grid" 
        aria-label="3x3 tone selection matrix"
        aria-describedby="tone-description"
      >
        {positions.map((pos, index) => (
          <button
            key={index}
            className={`tone-position ${pos.position} ${isSelected(pos.x, pos.y) ? 'selected' : ''} ${
              disabled ? 'disabled' : ''
            }`}
            onClick={() => handlePositionClick(pos.x, pos.y)}
            onKeyDown={(e) => handleKeyDown(e, pos.x, pos.y)}
            disabled={disabled}
            title={pos.label}
            aria-label={`${getPositionLabel(pos.position)} tone${isSelected(pos.x, pos.y) ? ' (currently selected)' : ''}`}

            tabIndex={0}
          >
            <div className="position-indicator" aria-hidden="true"></div>
            <span className="position-label" aria-hidden="true">{getPositionLabel(pos.position)}</span>
          </button>
        ))}
      </div>
      <div id="tone-description" className="tone-description">
        <p>Click any position to select tone style - corners for pure tones, edges for mixed tones</p>
      </div>
    </div>
  );
};

export default TonePicker;
