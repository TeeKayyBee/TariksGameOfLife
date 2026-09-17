/**
 * Unit tests for the useStoreValue hook.
 * Verifies both the initial read and the reactive update behavior
 * that useSyncExternalStore provides - a component using this hook
 * should re-render automatically when the underlying store value
 * changes via an admin write.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useStoreValue from '../useStoreValue';
import { setConstant, resetConstantsForTesting } from '../../store/constantsStore';

describe('useStoreValue', function useStoreValueTests() {
  beforeEach(function resetStore() {
    resetConstantsForTesting();
  });

  it('returns the current value for the given key', function testReturnsCurrentValue() {
    const { result } = renderHook(function callHook() {
      return useStoreValue('DEFAULT_SIMULATION_SPEED_MS');
    });

    expect(result.current).toBe(300);
  });

  it('re-renders with the new value after an admin write', function testReactsToStoreChange() {
    const { result } = renderHook(function callHook() {
      return useStoreValue('DEFAULT_SIMULATION_SPEED_MS');
    });

    act(function changeValue() {
      setConstant('DEFAULT_SIMULATION_SPEED_MS', 800, 'admin');
    });

    expect(result.current).toBe(800);
  });

  it('does not update when a write is denied due to insufficient permissions', function testIgnoresDeniedWrite() {
    const { result } = renderHook(function callHook() {
      return useStoreValue('DEFAULT_SIMULATION_SPEED_MS');
    });

    act(function attemptGuestWrite() {
      setConstant('DEFAULT_SIMULATION_SPEED_MS', 999, 'guest');
    });

    expect(result.current).toBe(300);
  });

  it('tracks a different key independently', function testTracksArbitraryKey() {
    const { result } = renderHook(function callHook() {
      return useStoreValue('MAX_HISTORY_LENGTH');
    });

    expect(result.current).toBe(50);

    act(function changeHistoryLength() {
      setConstant('MAX_HISTORY_LENGTH', 20, 'admin');
    });

    expect(result.current).toBe(20);
  });
});