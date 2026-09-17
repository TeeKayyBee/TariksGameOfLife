/**
 * Root component of the application. Owns useAuth so the admin login
 * session persists across opening/closing the admin panel - if
 * AdminSettings held auth state itself, closing the panel would
 * unmount it and silently log the admin out.
 */

import useGameOfLife from '../hooks/useGameOfLife';
import useAdminPanel from '../hooks/useAdminPanel';
import useAuth from '../hooks/useAuth';
import Header from './Header';
import Grid from './Grid';
import Controls from './Controls';
import AdminSettings from './AdminSettings';

function App() {
  const gameOfLife = useGameOfLife();
  const adminPanel = useAdminPanel();
  const auth = useAuth();

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
      {adminPanel.isOpen && (
        <AdminSettings role={auth.role} onLogin={auth.login} onLogout={auth.logout} />
      )}
    </div>
  );
}

export default App;