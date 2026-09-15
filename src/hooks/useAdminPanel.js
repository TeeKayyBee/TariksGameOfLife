/**
 * Controls whether the admin settings panel is visible.
 * Kept as its own hook, separate from useGameOfLife, since panel
 * visibility is UI state unrelated to the game's simulation state.
 */

import { useState, useCallback } from 'react';

/**
 * @returns {{ isOpen: boolean, toggle: () => void }}
 */
function useAdminPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(function toggle() {
    setIsOpen(function flipVisibility(prevIsOpen) {
      return !prevIsOpen;
    });
  }, []);

  return { isOpen, toggle };
}

export default useAdminPanel;