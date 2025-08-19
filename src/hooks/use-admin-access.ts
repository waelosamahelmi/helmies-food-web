import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'helmiesrestaurants1996';

export const useAdminAccess = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [typedSequence, setTypedSequence] = useState('');

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't capture keystrokes when user is typing in input fields
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const newSequence = typedSequence + event.key.toLowerCase();
      
      // Keep only the last characters that could match the password
      const trimmedSequence = newSequence.slice(-ADMIN_PASSWORD.length);
      setTypedSequence(trimmedSequence);
      
      // Check if the sequence matches the password
      if (trimmedSequence === ADMIN_PASSWORD) {
        setIsAdminOpen(true);
        setTypedSequence(''); // Reset sequence
      }
    };

    // Reset sequence after 3 seconds of inactivity
    const resetTimer = setTimeout(() => {
      setTypedSequence('');
    }, 3000);

    document.addEventListener('keypress', handleKeyPress);
    
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      clearTimeout(resetTimer);
    };
  }, [typedSequence]);

  const closeAdmin = () => {
    setIsAdminOpen(false);
    setTypedSequence('');
  };

  return {
    isAdminOpen,
    closeAdmin,
    typedSequence // For debugging purposes
  };
};
