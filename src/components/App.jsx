/**
 * Root component of the application. Contains no game state logic of
 * its own - that lives in useGameOfLife. Admin panel visibility is a
 * separate, unrelated piece of UI state via useAdminPanel.
 */

import useGameOfLife from '../hooks/useGameOfLife';
import useAdminPanel from '../hooks/useAdminPanel';
import Header from './Header';
import Grid from './Grid';
import Controls from './Controls';
import AdminSettings from './AdminSettings';

function App() {
  const gameOfLife = useGameOfLife();
  const adminPanel = useAdminPanel();

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
      <button className="admin-toggle" onClick={adminPanel.toggle}>
        {adminPanel.isOpen ? 'Admin-Bereich schließen' : 'Admin-Bereich öffnen'}
      </button>
      {adminPanel.isOpen && <AdminSettings />}
    </div>
  );
}

export default App;