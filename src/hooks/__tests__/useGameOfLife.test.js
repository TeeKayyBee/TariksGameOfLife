/**
 * Unit tests for the useGameOfLife hook.
 * Uses fake timers to control the simulation interval deterministically.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useGameOfLife from '../useGameOfLife';
import { getConstant, resetConstantsForTesting } from '../../store/constantsStore';

describe('useGameOfLife', function useGameOfLifeTests() {
  beforeEach(function setup() {
    vi.useFakeTimers();
    resetConstantsForTesting();
  });

  afterEach(function restoreRealTimers() {
    vi.useRealTimers();
  });

  it('starts with an empty grid of the default size', function testInitialState() {
    const { result } = renderHook(useGameOfLife);

    expect(result.current.grid).toHaveLength(getConstant('DEFAULT_TILE_SIZE'));
    expect(result.current.isRunning).toBe(false);
    expect(result.current.canStepForward).toBe(false);
  });

  it('toggles a cell from dead to alive on handleCellClick', function testCellClickToggle() {
    const { result } = renderHook(useGameOfLife);

    act(function clickCell() {
      result.current.handleCellClick(0, 0);
    });

    expect(result.current.grid[0][0]).toBe(1);
    expect(result.current.canStepForward).toBe(true);
  });

  it('advances one generation on handleStepForward', function testStepForward() {
    const { result } = renderHook(useGameOfLife);

    act(function createBlinker() {
      result.current.handleCellClick(2, 1);
      result.current.handleCellClick(2, 2);
      result.current.handleCellClick(2, 3);
    });

    act(function stepForward() {
      result.current.handleStepForward();
    });

    expect(result.current.grid[1][2]).toBe(1);
    expect(result.current.grid[2][1]).toBe(0);
    expect(result.current.canStepBackward).toBe(true);
  });

  it('restores the previous grid on handleStepBackward', function testStepBackward() {
    const { result } = renderHook(useGameOfLife);

    act(function setupAndAdvance() {
      result.current.handleCellClick(2, 2);
      result.current.handleStepForward();
    });

    act(function stepBack() {
      result.current.handleStepBackward();
    });

    expect(result.current.grid[2][2]).toBe(1);
    expect(result.current.canStepBackward).toBe(false);
  });

  it('automatically advances generations while running', function testAutomaticSimulation() {
    const { result } = renderHook(useGameOfLife);

    act(function createBlinkerAndStart() {
      result.current.handleCellClick(2, 1);
      result.current.handleCellClick(2, 2);
      result.current.handleCellClick(2, 3);
      result.current.handleStart();
    });

    act(function advanceOneInterval() {
      vi.advanceTimersByTime(getConstant('DEFAULT_SIMULATION_SPEED_MS'));
    });

    expect(result.current.grid[1][2]).toBe(1);
    expect(result.current.isRunning).toBe(true);
  });

  it('automatically stops once the grid dies out', function testAutoStop() {
    const { result } = renderHook(useGameOfLife);

    act(function createIsolatedCellAndStart() {
      result.current.handleCellClick(2, 2);
      result.current.handleStart();
    });

    act(function advanceOneInterval() {
      vi.advanceTimersByTime(getConstant('DEFAULT_SIMULATION_SPEED_MS'));
    });

    expect(result.current.isRunning).toBe(false);
  });

  it('clears the grid and history on handleReset', function testReset() {
    const { result } = renderHook(useGameOfLife);

    act(function setupState() {
      result.current.handleCellClick(2, 2);
      result.current.handleStepForward();
    });

    act(function reset() {
      result.current.handleReset();
    });

    expect(result.current.canStepForward).toBe(false);
    expect(result.current.canStepBackward).toBe(false);
  });

  it('changes the grid size on handleTileSizeChange', function testTileSizeChange() {
    const { result } = renderHook(useGameOfLife);

    act(function changeSize() {
      result.current.handleTileSizeChange(10);
    });

    expect(result.current.tileSize).toBe(10);
    expect(result.current.grid).toHaveLength(10);
  });
});