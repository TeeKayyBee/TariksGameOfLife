import { useState, useEffect, useRef } from 'react';
import { createEmptyGrid, computeNextGeneration, hasAliveCells } from '../helpers/gameLogic';
import Grid from './Grid';

/**
 * Die Wurzelkomponente (Root Component) der Game of Life Anwendung.
 * 
 * @remarks
 * Diese Komponente dient als Layout-Container und verwaltet den globalen Zustand
 * der Simulation. Sie koordiniert das Spielfeld (Grid), die Kontrolltasten
 * (Start, Stopp, Reset) und die Anzeige der aktuellen Generation.
 * 
 * @param props - Die React-Props der Komponente (aktuell keine standardmäßig übergeben).
 * @returns Die gerenderte App-Oberfläche als JSX-Element structure.
 */

function App() {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [history, setHistory] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const [speed, setSpeed] = useState(300);

  /**
   * Invertiert den Zustand einer einzelnen Zelle (lebend/tot) beim Klicken.
   * 
   * @param row - Der Zeilenindex der angeklickten Zelle.
   * @param col - Der Spaltenindex der angeklickten Zelle.
   */
  function handleCellClick(row, col) {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => [...r]); 
      newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1;
      return newGrid;
    });
  }

  /**
   * Berechnet manuell die nächste Generation und fügt den aktuellen Zustand der Historie hinzu.
   */
  function handleStepForward() {
    if (!hasAliveCells(grid)) return;
    setHistory(prevHistory => [...prevHistory, grid]);
    setGrid(prevGrid => computeNextGeneration(prevGrid));
  }

  /**
   * Versetzt das Spielfeld in den vorherigen Zustand zurück, sofern Einträge in der Historie existieren.
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
   * Stoppt die laufende Simulation, leert das Spielfeld und setzt die Historie zurück.
   */
  function handleReset() {
    setIsRunning(false);
    setGrid(createEmptyGrid());
    setHistory([]);
  }

  /**
   * Verwaltet den Simulations-Timer (Interval), der die Generationen automatisch weiterschaltet.
   * 
   * @remarks
   * Der Effekt startet oder stoppt das Intervall basierend auf dem `isRunning`-Status 
   * und aktualisiert die Abspielgeschwindigkeit anhand der `speed`-Variable.
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
   * Überprüft kontinuierlich, ob noch lebende Zellen auf dem Spielfeld existieren.
   * Stoppt die automatische Simulation selbstständig, sobald das gesamte Spielfeld ausgestorben ist.
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