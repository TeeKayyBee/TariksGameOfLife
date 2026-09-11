import { useState, useEffect, useRef } from 'react';
import { createEmptyGrid, computeNextGeneration, hasAliveCells } from '../helpers/gameLogic';
import Grid from './Grid';

/**
 * Root Component of the Game of Life application.
 * 
 * @remarks
 * Serves as the main layout container and manages the global state
 * of the simulation. It coordinates the grid board, action controls
 * (Start, Stop, Reset, Step), and playback parameters.
 * 
 * @param props - React props passed to the component (none by default).
 * @returns The rendered application interface as a JSX element structure.
 */

function App() {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [history, setHistory] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const [speed, setSpeed] = useState(300);

  /**
   * Toggles the state of a single cell (alive/dead) when clicked.
   * 
   * @param row - The row index of the clicked cell.
   * @param col - The column index of the clicked cell.
   */
  function handleCellClick(row, col) {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => [...r]); 
      newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1;
      return newGrid;
    });
  }

  /**
   * Manually computes the next generation and pushes the current state to history.
   */
  function handleStepForward() {
    if (!hasAliveCells(grid)) return;
    setHistory(prevHistory => [...prevHistory, grid]);
    setGrid(prevGrid => computeNextGeneration(prevGrid));
  }

  /**
   * Reverts the game board to its previous state if history entries exist.
   */
  function handleStepBackward() {
    setHistory(prevHistory => {
      if (prevHistory.length === 0) return prevHistory;

      const newHistory = prevHistory.slice(0, -1);
      const lastGrid = prevHistory[prevHistory.length -1];
      setGrid(lastGrid);
      return newHistory;
    })
  }

  /**
   * Stops the ongoing simulation, clears the game board, and resets history.
   */
  function handleReset() {
    setIsRunning(false);
    setGrid(createEmptyGrid());
    setHistory([]);
  }

  /**
   * Manages the simulation interval timer that automatically advances generations.
   * 
   * @remarks
   * Starts or stops the interval based on the `isRunning` state flag
   * and updates playback speed according to the `speed` variable.
   */
  useEffect(() => {
    if(isRunning) {
      intervalRef.current = setInterval(() => {
        setGrid(prevGrid => {
          if(hasAliveCells(prevGrid)) {
            setHistory(prevHistory => [...prevHistory, prevGrid]);
          }
          return computeNextGeneration(prevGrid);
        });
      }, speed);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, grid]);

  /**
   * Continuously monitors whether living cells remain on the grid.
   * Automatically stops the simulation once all cells die out.
   */
  useEffect(() => {
    if (isRunning && !hasAliveCells(grid)) {
      setIsRunning(false);
    }
  }, [grid, isRunning]);

  return (
    <div className="app">
      <h1>Tarik's Game of Life</h1>
      <Grid grid={grid} onCellClick={handleCellClick} />
      <div className='controls'>
        <button onClick={handleStepBackward} disabled={history.length === 0}>Schritt zurück</button>
        <button onClick={handleStepForward} disabled={isRunning || !hasAliveCells(grid)}>Schritt vor</button>
        <button onClick={() => setIsRunning(true)} disabled={isRunning || !hasAliveCells(grid)}>Start</button>
        <button onClick={() => setIsRunning(false)} disabled={!isRunning}>Stop</button>
        <button onClick={handleReset}>Reset</button>
          
      </div>
      <div className="speed-control">
        <label htmlFor="speed">Geschwindigkeit</label>
        <input
          id="speed"
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
        />
        <span>{speed}ms</span>
      </div>          
    </div>
  );
}

export default App;