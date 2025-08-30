import React, { useEffect, useState } from 'react';
import './ScreenReaderAnnouncer.css';

interface ScreenReaderAnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

const ScreenReaderAnnouncer: React.FC<ScreenReaderAnnouncerProps> = ({ 
  message, 
  priority = 'polite' 
}) => {
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      // Clear the message after a short delay to allow for repeated announcements
      const timer = setTimeout(() => {
        setCurrentMessage('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      className="screen-reader-announcer"
      role="status"
      aria-live={priority}
      aria-atomic="true"
    >
      {currentMessage}
    </div>
  );
};

export default ScreenReaderAnnouncer;
