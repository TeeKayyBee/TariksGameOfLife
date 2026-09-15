/**
 * Renders a single cell of the grid.
 * Implemented as a native <button> for keyboard accessibility
 * (Tab + Enter/Space work automatically, no manual tabIndex or
 * onKeyDown needed).
 *
 * Wrapped in React.memo: since onCellClick is a stable reference
 * (memoized in useGameOfLife via useCallback) and row/col never
 * change for a given cell instance, a cell only re-renders when its
 * own isAlive value actually changes - not on every tick for the
 * entire grid.
 */

import { memo } from 'react';

/**
 * @param {{
 *   isAlive: boolean,
 *   row: number,
 *   col: number,
 *   onCellClick: (row: number, col: number) => void
 * }} props
 */
function Cell({ isAlive, row, col, onCellClick }) {
  function handleClick() {
    onCellClick(row, col);
  }

  return (
    <button
      type="button"
      className={`cell ${isAlive ? 'alive' : 'dead'}`}
      onClick={handleClick}
      aria-pressed={isAlive}
      aria-label={`Row ${row + 1}, column ${col + 1}, ${isAlive ? 'alive' : 'dead'}`}
    />
  );
}

export default memo(Cell);