/**
 * Slider for adjusting the simulation speed (interval between
 * automatic generation steps).
 */

import {
  MIN_SIMULATION_SPEED_MS,
  MAX_SIMULATION_SPEED_MS,
  SIMULATION_SPEED_STEP_MS,
} from '../constants';

/**
 * @param {{
 *   speedMs: number,
 *   onSpeedChange: (newSpeedMs: number) => void
 * }} props
 */
function SpeedSelector({ speedMs, onSpeedChange }) {
  function handleChange(event) {
    onSpeedChange(Number(event.target.value));
  }

  return (
    <div className="speed-selector">
      <label htmlFor="speed">Geschwindigkeit</label>
      <input
        id="speed"
        type="range"
        min={MIN_SIMULATION_SPEED_MS}
        max={MAX_SIMULATION_SPEED_MS}
        step={SIMULATION_SPEED_STEP_MS}
        value={speedMs}
        onChange={handleChange}
      />
      <span>{speedMs}ms</span>
    </div>
  );
}

export default SpeedSelector;