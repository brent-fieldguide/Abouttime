import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import BigButton from '../common/BigButton';

export default function ReadAloudButton({ text, isReading, onReadingChange }) {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const handleToggleRead = useCallback(() => {
    if (!isSupported || !text) return;

    if (isReading) {
      window.speechSynthesis.cancel();
      onReadingChange(false);
    } else {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Configure for child-friendly reading
      utterance.rate = 0.85; // Slightly slower
      utterance.pitch = 1.1; // Slightly higher pitch

      // Try to find a friendly voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.name.includes('Samantha') ||
          v.name.includes('Karen') ||
          v.name.includes('Daniel') ||
          v.lang.startsWith('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        onReadingChange(false);
      };

      utterance.onerror = () => {
        onReadingChange(false);
      };

      window.speechSynthesis.speak(utterance);
      onReadingChange(true);
    }
  }, [isSupported, text, isReading, onReadingChange]);

  // Stop reading when text changes
  useEffect(() => {
    if (isReading) {
      window.speechSynthesis.cancel();
      onReadingChange(false);
    }
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!isSupported) return null;

  return (
    <BigButton
      variant={isReading ? 'magic' : 'secondary'}
      size="medium"
      onClick={handleToggleRead}
    >
      {isReading ? (
        <>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="mr-2"
          >
            🔊
          </motion.span>
          Stop Reading
        </>
      ) : (
        <>
          <span className="mr-2">🔈</span>
          Read Aloud
        </>
      )}
    </BigButton>
  );
}
