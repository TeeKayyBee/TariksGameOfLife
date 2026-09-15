/**
 * Contains all control buttons for the simulation
 * (step backward/forward, start, stop, randomize, reset).
 * Button labels are read from constantsStore, so an admin can
 * change them at runtime.
 */

import { getConstant } from '../store/constantsStore';

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
  const uiText = getConstant('UI_TEXT');

  return (
    <div className="action-buttons">
      <button onClick={onStepBackward} disabled={!canStepBackward || isRunning}>
        {uiText.stepBackward}
      </button>
      <button onClick={onStepForward} disabled={isRunning || !canStepForward}>
        {uiText.stepForward}
      </button>
      <button onClick={onStart} disabled={isRunning || !canStepForward}>
        {uiText.start}
      </button>
      <button onClick={onStop} disabled={!isRunning}>
        {uiText.stop}
      </button>
      <button onClick={onRandomize}>
        {uiText.randomize}
      </button>
      <button onClick={onReset}>
        {uiText.reset}
      </button>
    </div>
  );
}

export default ActionButtons;