import React from 'react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  onDismiss 
}) => {
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h4>Error</h4>
        <p>{message}</p>
        <div className="error-actions">
          {onRetry && (
            <button 
              className="error-button retry" 
              onClick={onRetry}
            >
              Try Again
            </button>
          )}
          {onDismiss && (
            <button 
              className="error-button dismiss" 
              onClick={onDismiss}
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
