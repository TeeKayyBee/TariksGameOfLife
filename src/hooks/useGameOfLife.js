/**
 * Custom hook that encapsulates the entire state and all handlers
 * for Conway's Game of Life. This keeps App.jsx limited to pure
 * composition, with no state logic of its own.
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from 'react';
import {
  createEmptyGrid,
  createRandomGrid,
  computeNextGeneration,
  hasAliveCells,
} from '../helpers/gameLogic';
import { getConstant, subscribeToConstants } from '../store/constantsStore';

/**
 * Appends a grid to the history, discarding the oldest entries once
 * the store's MAX_HISTORY_LENGTH is exceeded. Reads the limit fresh
 * on every call, so an admin change takes effect immediately.
 *
 * @param {number[][][]} history
 * @param {number[][]} gridToStore
 * @returns {number[][][]}
 */
function appendToHistory(history, gridToStore) {
  const maxLength = getConstant('MAX_HISTORY_LENGTH');
  const extended = [...history, gridToStore];
  if (extended.length <= maxLength) {
    return extended;
  }
  return extended.slice(extended.length - maxLength);
}

/**
 * @returns {{
 *   grid: number[][],
 *   tileSize: number,
 *   speedMs: number,
 *   isRunning: boolean,
 *   canStepBackward: boolean,
 *   canStepForward: boolean,
 *   handleCellClick: (row: number, col: number) => void,
 *   handleStepForward: () => void,
 *   handleStepBackward: () => void,
 *   handleStart: () => void,
 *   handleStop: () => void,
 *   handleReset: () => void,
 *   handleRandomize: () => void,
 *   handleTileSizeChange: (newSize: number) => void,
 *   handleSpeedChange: (newSpeedMs: number) => void
 * }} The complete game state along with actions to control it.
 */
function useGameOfLife() {
  /**
   * Subscribes to the store's default speed and default tile size.
   * This is what lets an admin's change reach an already-running
   * simulation - the effects below react whenever these synced
   * values change.
   */
  const storeDefaultSpeed = useSyncExternalStore(
    subscribeToConstants,
    function getDefaultSpeedSnapshot() {
      return getConstant('DEFAULT_SIMULATION_SPEED_MS');
    }
  );
  const storeDefaultTileSize = useSyncExternalStore(
    subscribeToConstants,
    function getDefaultTileSizeSnapshot() {
      return getConstant('DEFAULT_TILE_SIZE');
    }
  );

  const [tileSize, setTileSize] = useState(function initTileSize() {
    return getConstant('DEFAULT_TILE_SIZE');
  });
  const [speedMs, setSpeedMs] = useState(storeDefaultSpeed);
  const [grid, setGrid] = useState(function initGrid() {
    return createEmptyGrid(getConstant('DEFAULT_TILE_SIZE'));
  });
  const [history, setHistory] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // Holds the current tick logic so the interval effect can call it
  // without listing grid/tileSize as dependencies - that would tear
  // down and recreate the interval on every single tick.
  const tickRef = useRef(null);

  /**
   * Applies an admin's change to the default speed immediately, even
   * to an already-running simulation. Deliberately only listens to
   * storeDefaultSpeed (not every store change), so it does not fire
   * on unrelated admin edits (e.g. changing a button label).
   */
  useEffect(function applyAdminSpeedChangeLive() {
    setSpeedMs(function updateSpeedIfChanged(prevSpeed) {
      return prevSpeed === storeDefaultSpeed ? prevSpeed : storeDefaultSpeed;
    });
  }, [storeDefaultSpeed]);

  /**
   * Applies an admin's change to the default tile size immediately,
   * even to an already-running simulation. This is destructive by
   * necessity - a grid of a different size cannot be meaningfully
   * carried over - so it resets the grid, history and running state,
   * exactly like a manual handleTileSizeChange call would.
   */
  useEffect(function applyAdminTileSizeChangeLive() {
    setTileSize(function updateTileSizeIfChanged(prevTileSize) {
      if (prevTileSize === storeDefaultTileSize) return prevTileSize;

      setIsRunning(false);
      setGrid(createEmptyGrid(storeDefaultTileSize));
      setHistory([]);
      return storeDefaultTileSize;
    });
  }, [storeDefaultTileSize]);

  /**
   * Advances the simulation by exactly one generation.
   * Both the manual "step forward" button and the automatic interval
   * funnel through this single function, so the two paths can never
   * drift apart in behavior.
   */
  function advanceOneGeneration() {
    if (!hasAliveCells(grid)) {
      setIsRunning(false);
      return;
    }

    const nextGrid = computeNextGeneration(grid, tileSize);

    setHistory(function storePreviousGrid(prevHistory) {
      return appendToHistory(prevHistory, grid);
    });
    setGrid(nextGrid);

    if (!hasAliveCells(nextGrid)) {
      setIsRunning(false);
    }
  }

  // Keep the ref pointing at the latest version of the tick function,
  // so the interval always calls current logic with current state.
  tickRef.current = advanceOneGeneration;

  /**
   * Toggles the alive/dead state of a single cell.
   * Wrapped in useCallback with an empty dependency array: it only
   * ever uses the functional setGrid(prevGrid => ...) form, so the
   * reference stays stable - required for Cell's React.memo to work.
   * @param {number} row
   * @param {number} col
   */
  const handleCellClick = useCallback(function handleCellClick(row, col) {
    setGrid(function toggleCell(prevGrid) {
      const newGrid = prevGrid.map(function copyRow(r) {
        return [...r];
      });
      newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1;
      return newGrid;
    });
  }, []);

  /**
   * Manually advances exactly one generation.
   * Intentionally NOT memoized - it closes over grid/tileSize and
   * must pick up fresh values on every render.
   */
  function handleStepForward() {
    advanceOneGeneration();
  }

  /** Jumps back to the most recently stored grid state in the history. */
  const handleStepBackward = useCallback(function handleStepBackward() {
    setHistory(function popLastGrid(prevHistory) {
      if (prevHistory.length === 0) return prevHistory;
      const newHistory = prevHistory.slice(0, -1);
      const lastGrid = prevHistory[prevHistory.length - 1];
      setGrid(lastGrid);
      return newHistory;
    });
  }, []);

  /** Starts the automatic simulation. */
  const handleStart = useCallback(function handleStart() {
    setIsRunning(true);
  }, []);

  /** Pauses the automatic simulation. */
  const handleStop = useCallback(function handleStop() {
    setIsRunning(false);
  }, []);

  /**
   * Resets the grid and history back to the empty starting state.
   * Intentionally NOT memoized - it closes over tileSize and must
   * use the current value, not a stale one from mount.
   */
  function handleReset() {
    setIsRunning(false);
    setGrid(createEmptyGrid(tileSize));
    setHistory([]);
  }

  /**
   * Fills the grid with a new random pattern.
   * Intentionally NOT memoized - closes over tileSize.
   */
  function handleRandomize() {
    setIsRunning(false);
    setGrid(createRandomGrid(tileSize));
    setHistory([]);
  }

  /**
   * Changes the grid size in response to the user manually picking a
   * different option in the tile size dropdown.
   * @param {number} newSize
   */
  const handleTileSizeChange = useCallback(function handleTileSizeChange(newSize) {
    setIsRunning(false);
    setTileSize(newSize);
    setGrid(createEmptyGrid(newSize));
    setHistory([]);
  }, []);

  /**
   * Updates the simulation speed in response to the user manually
   * moving the speed slider.
   * @param {number} newSpeedMs
   */
  const handleSpeedChange = useCallback(function handleSpeedChange(newSpeedMs) {
    setSpeedMs(newSpeedMs);
  }, []);

  /**
   * Drives the automatic simulation. Depends only on isRunning and
   * speedMs - deliberately NOT on grid, so the timer runs
   * uninterrupted instead of being torn down and recreated every tick.
   */
  useEffect(function runSimulationInterval() {
    if (!isRunning) return undefined;

    const intervalId = setInterval(function tick() {
      tickRef.current();
    }, speedMs);

    return function cleanupInterval() {
      clearInterval(intervalId);
    };
  }, [isRunning, speedMs]);

  return {
    grid,
    tileSize,
    speedMs,
    isRunning,
    canStepBackward: history.length > 0,
    canStepForward: hasAliveCells(grid),
    handleCellClick,
    handleStepForward,
    handleStepBackward,
    handleStart,
    handleStop,
    handleReset,
    handleRandomize,
    handleTileSizeChange,
    handleSpeedChange,
  };
}

export default useGameOfLife;