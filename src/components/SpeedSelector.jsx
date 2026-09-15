/**
 * Slider for adjusting the simulation speed. Bounds and label text
 * are read from constantsStore, so an admin can change them at runtime.
 */

import { getConstant } from '../store/constantsStore';

/**
 * @param {{
 *   speedMs: number,
 *   onSpeedChange: (newSpeedMs: number) => void
 * }} props
 */
function SpeedSelector({ speedMs, onSpeedChange }) {
  const minSpeed = getConstant('MIN_SIMULATION_SPEED_MS');
  const maxSpeed = getConstant('MAX_SIMULATION_SPEED_MS');
  const stepSpeed = getConstant('SIMULATION_SPEED_STEP_MS');
  const uiText = getConstant('UI_TEXT');

  function handleChange(event) {
    onSpeedChange(Number(event.target.value));
  }

  return (
    <div className="speed-selector">
      <label htmlFor="speed">{uiText.speedLabel}</label>
      <input
        id="speed"
        type="range"
        min={minSpeed}
        max={maxSpeed}
        step={stepSpeed}
        value={speedMs}
        onChange={handleChange}
      />
      <span>{speedMs}ms</span>
    </div>
  );
}

export default SpeedSelector;