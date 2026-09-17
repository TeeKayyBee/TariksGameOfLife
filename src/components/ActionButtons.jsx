/**
 * Contains all control buttons for the simulation
 * (step backward/forward, start, stop, randomize, reset).
 */

/**
 * @param {{
 *   isRunning: boolean,
 *   canStepBackward: boolean,
 *   canStepForward: boolean,
 *   onStepBackward: () => void,
 *   onStepForward: () => void,
 *   onStart: () => void,
 *   onStop: () => void,
 *   onRandomize: () => void,
 *   onReset: () => void
 * }} props
 */
function ActionButtons({
  isRunning,
  canStepBackward,
  canStepForward,
  onStepBackward,
  onStepForward,
  onStart,
  onStop,
  onRandomize,
  onReset,
}) {
  return (
    <div className="action-buttons">
      <button onClick={onStepBackward} disabled={!canStepBackward || isRunning}>
        Schritt zurück
      </button>
      <button onClick={onStepForward} disabled={isRunning || !canStepForward}>
        Schritt vor
      </button>
      <button onClick={onStart} disabled={isRunning || !canStepForward}>
        Start
      </button>
      <button onClick={onStop} disabled={!isRunning}>
        Stop
      </button>
      <button onClick={onRandomize}>
        Zufall
      </button>
      <button onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

export default ActionButtons;