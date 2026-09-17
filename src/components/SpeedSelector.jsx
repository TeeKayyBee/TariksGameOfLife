/**
 * Slider for adjusting the simulation speed. Bounds and label text
 * are read reactively from constantsStore via useStoreValue, so an
 * admin's edit updates them immediately.
 */

import useStoreValue from '../hooks/useStoreValue';

/**
 * @param {{
 *   speedMs: number,
 *   onSpeedChange: (newSpeedMs: number) => void
 * }} props
 */
function SpeedSelector({ speedMs, onSpeedChange }) {
  const minSpeed = useStoreValue('MIN_SIMULATION_SPEED_MS');
  const maxSpeed = useStoreValue('MAX_SIMULATION_SPEED_MS');
  const stepSpeed = useStoreValue('SIMULATION_SPEED_STEP_MS');
  const uiText = useStoreValue('UI_TEXT');

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