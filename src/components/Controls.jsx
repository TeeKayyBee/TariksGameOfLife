/**
 * Container component that combines the control elements
 * (ActionButtons, TileSizeSelector and SpeedSelector).
 */

import ActionButtons from './ActionButtons';
import TileSizeSelector from './TileSizeSelector';
import SpeedSelector from './SpeedSelector';

/**
 * @param {{
 *   isRunning: boolean,
 *   tileSize: number,
 *   speedMs: number,
 *   canStepBackward: boolean,
 *   canStepForward: boolean,
 *   onStepBackward: () => void,
 *   onStepForward: () => void,
 *   onStart: () => void,
 *   onStop: () => void,
 *   onRandomize: () => void,
 *   onReset: () => void,
 *   onTileSizeChange: (newSize: number) => void,
 *   onSpeedChange: (newSpeedMs: number) => void
 * }} props
 */
function Controls({
  isRunning,
  tileSize,
  speedMs,
  canStepBackward,
  canStepForward,
  onStepBackward,
  onStepForward,
  onStart,
  onStop,
  onRandomize,
  onReset,
  onTileSizeChange,
  onSpeedChange,
}) {
  return (
    <div className="controls">
      <ActionButtons
        isRunning={isRunning}
        canStepBackward={canStepBackward}
        canStepForward={canStepForward}
        onStepBackward={onStepBackward}
        onStepForward={onStepForward}
        onStart={onStart}
        onStop={onStop}
        onRandomize={onRandomize}
        onReset={onReset}
      />
      <TileSizeSelector tileSize={tileSize} onTileSizeChange={onTileSizeChange} />
      <SpeedSelector speedMs={speedMs} onSpeedChange={onSpeedChange} />
    </div>
  );
}

export default Controls;