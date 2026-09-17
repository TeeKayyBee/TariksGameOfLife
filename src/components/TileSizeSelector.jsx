/**
 * Dropdown for selecting the grid size from a fixed list
 * of options (see TILE_SIZE_OPTIONS in constants.js).
 */

import { TILE_SIZE_OPTIONS } from '../constants';

/**
 * Renders a single selectable option for a grid size.
 * @param {number} size
 */
function renderOption(size) {
  return (
    <option key={size} value={size}>
      {size} x {size}
    </option>
  );
}

/**
 * @param {{
 *   tileSize: number,
 *   onTileSizeChange: (newSize: number) => void
 * }} props
 */
function TileSizeSelector({ tileSize, onTileSizeChange }) {
  function handleChange(event) {
    onTileSizeChange(Number(event.target.value));
  }

  return (
    <div className="tile-size-selector">
      <label htmlFor="tile-size">Rastergröße</label>
      <select id="tile-size" value={tileSize} onChange={handleChange}>
        {TILE_SIZE_OPTIONS.map(renderOption)}
      </select>
    </div>
  );
}

export default TileSizeSelector;