/**
 * Root component of the application. Deliberately contains no state
 * logic of its own - that lives entirely in the useGameOfLife hook.
 * App.jsx is limited to composing components and passing down props.
 */

import useGameOfLife from '../hooks/useGameOfLife';
import Header from './Header';
import Grid from './Grid';
import Controls from './Controls';

function App() {
  const gameOfLife = useGameOfLife();

  return (
    <div className="app">
      <Header />
      <Grid
        grid={gameOfLife.grid}
        tileSize={gameOfLife.tileSize}
        onCellClick={gameOfLife.handleCellClick}
      />
      <Controls
        isRunning={gameOfLife.isRunning}
        tileSize={gameOfLife.tileSize}
        speedMs={gameOfLife.speedMs}
        canStepBackward={gameOfLife.canStepBackward}
        canStepForward={gameOfLife.canStepForward}
        onStepBackward={gameOfLife.handleStepBackward}
        onStepForward={gameOfLife.handleStepForward}
        onStart={gameOfLife.handleStart}
        onStop={gameOfLife.handleStop}
        onRandomize={gameOfLife.handleRandomize}
        onReset={gameOfLife.handleReset}
        onTileSizeChange={gameOfLife.handleTileSizeChange}
        onSpeedChange={gameOfLife.handleSpeedChange}
      />
    </div>
  );
}

export default App;