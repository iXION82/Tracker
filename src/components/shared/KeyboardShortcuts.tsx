'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.hasAttribute('contenteditable')
      ) {
        return;
      }

      // Ignore if modifier keys are pressed (except for Ctrl+K handled elsewhere)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();
      
      switch (key) {
        case 'n':
          e.preventDefault();
          // Dispatch a custom event to open 'New Habit' dialog
          document.dispatchEvent(new CustomEvent('lifeos:new-habit'));
          break;
        case 't':
          e.preventDefault();
          router.push('/today');
          break;
        case 'g':
          e.preventDefault();
          router.push('/goals');
          break;
        case 'a':
          e.preventDefault();
          router.push('/analytics');
          break;
        case 'j':
          e.preventDefault();
          router.push('/journal');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return null; // This component doesn't render anything
}
