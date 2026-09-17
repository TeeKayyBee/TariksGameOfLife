/**
 * Dropdown for selecting the grid size. Both the available options
 * and the label text are read reactively from constantsStore via
 * useStoreValue, so an admin's edit updates them immediately.
 */

import useStoreValue from '../hooks/useStoreValue';

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
  const tileSizeOptions = useStoreValue('TILE_SIZE_OPTIONS');
  const uiText = useStoreValue('UI_TEXT');

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