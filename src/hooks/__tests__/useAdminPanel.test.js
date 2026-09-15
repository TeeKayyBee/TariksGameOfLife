/**
 * Unit tests for the useAdminPanel hook.
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAdminPanel from '../useAdminPanel';

describe('useAdminPanel', function useAdminPanelTests() {
  it('starts closed', function testInitiallyClosed() {
    const { result } = renderHook(useAdminPanel);

    expect(result.current.isOpen).toBe(false);
  });

  it('opens on the first toggle', function testFirstToggleOpens() {
    const { result } = renderHook(useAdminPanel);

    act(function toggleOnce() {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('closes again on a second toggle', function testSecondToggleCloses() {
    const { result } = renderHook(useAdminPanel);

    act(function toggleTwice() {
      result.current.toggle();
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(false);
  });
});