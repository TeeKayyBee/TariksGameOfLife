/**
 * Dropdown for selecting the grid size. Options and label text are
 * read from constantsStore, so an admin can change them at runtime.
 */

import { getConstant } from '../store/constantsStore';

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
  const tileSizeOptions = getConstant('TILE_SIZE_OPTIONS');
  const uiText = getConstant('UI_TEXT');

  function handleChange(event) {
    onTileSizeChange(Number(event.target.value));
  }

  return (
    <div className="tile-size-selector">
      <label htmlFor="tile-size">{uiText.tileSizeLabel}</label>
      <select id="tile-size" value={tileSize} onChange={handleChange}>
        {tileSizeOptions.map(renderOption)}
      </select>
    </div>
  );
}

export default TileSizeSelector;