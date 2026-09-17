/**
 * Custom hook that encapsulates the entire state and all handlers
 * for Conway's Game of Life. This keeps App.jsx limited to pure
 * composition, with no state logic of its own.
 */

import { useState, useRef, useEffect } from 'react';
import {
  createEmptyGrid,
  createRandomGrid,
  computeNextGeneration,
  hasAliveCells,
} from '../helpers/gameLogic';
import { DEFAULT_TILE_SIZE, DEFAULT_SIMULATION_SPEED_MS } from '../constants';

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
  const [tileSize, setTileSize] = useState(DEFAULT_TILE_SIZE);
  const [speedMs, setSpeedMs] = useState(DEFAULT_SIMULATION_SPEED_MS);
  const [grid, setGrid] = useState(function initGrid() {
    return createEmptyGrid(DEFAULT_TILE_SIZE);
  });
  const [history, setHistory] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  /**
   * Toggles the alive/dead state of a single cell.
   * @param {number} row
   * @param {number} col
   */
  function handleCellClick(row, col) {
    setGrid(function toggleCell(prevGrid) {
      const newGrid = prevGrid.map(function copyRow(r) {
        return [...r];
      });
      newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1;
      return newGrid;
    });
  }

  /** Manually advances exactly one generation and saves the previous state to history. */
  function handleStepForward() {
    if (!hasAliveCells(grid)) return;
    setHistory(function pushCurrentGrid(prevHistory) {
      return [...prevHistory, grid];
    });
    setGrid(function advanceGrid(prevGrid) {
      return computeNextGeneration(prevGrid, tileSize);
    });
  }

  /** Jumps back to the most recently stored grid state in the history. */
  function handleStepBackward() {
    setHistory(function popLastGrid(prevHistory) {
      if (prevHistory.length === 0) return prevHistory;
      const newHistory = prevHistory.slice(0, -1);
      const lastGrid = prevHistory[prevHistory.length - 1];
      setGrid(lastGrid);
      return newHistory;
    });
  }

  /** Starts the automatic simulation. */
  function handleStart() {
    setIsRunning(true);
  }

  /** Pauses the automatic simulation. */
  function handleStop() {
    setIsRunning(false);
  }

  /** Resets the grid and history back to the empty starting state. */
  function handleReset() {
    setIsRunning(false);
    setGrid(createEmptyGrid(tileSize));
    setHistory([]);
  }

  /** Fills the grid with a new random pattern. */
  function handleRandomize() {
    setIsRunning(false);
    setGrid(createRandomGrid(tileSize));
    setHistory([]);
  }

  /**
   * Changes the grid size. This necessarily resets the grid and history,
   * since a grid of a different size cannot be meaningfully carried over.
   * @param {number} newSize
   */
  function handleTileSizeChange(newSize) {
    setIsRunning(false);
    setTileSize(newSize);
    setGrid(createEmptyGrid(newSize));
    setHistory([]);
  }

  /**
   * Updates the simulation speed (interval between automatic steps).
   * Takes effect immediately, even while the simulation is running,
   * since speedMs is part of the interval effect's dependency array.
   * @param {number} newSpeedMs
   */
  function handleSpeedChange(newSpeedMs) {
    setSpeedMs(newSpeedMs);
  }

  // Drives the automatic simulation via interval as long as isRunning is true.
  // Re-runs whenever speedMs changes, so a speed change while running is
  // picked up immediately instead of only on the next tick.
  useEffect(function runSimulationInterval() {
    if (isRunning) {
      intervalRef.current = setInterval(function tick() {
        setGrid(function advanceOneTick(prevGrid) {
          if (hasAliveCells(prevGrid)) {
            setHistory(function pushTickGrid(prevHistory) {
              return [...prevHistory, prevGrid];
            });
          }
          return computeNextGeneration(prevGrid, tileSize);
        });
      }, speedMs);
    }

    return function cleanupInterval() {
      clearInterval(intervalRef.current);
    };
  }, [isRunning, grid, tileSize, speedMs]);

  // Automatically stops the simulation once no cell is alive anymore.
  useEffect(function autoStopWhenDead() {
    if (isRunning && !hasAliveCells(grid)) {
      setIsRunning(false);
    }
  }, [grid, isRunning]);

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