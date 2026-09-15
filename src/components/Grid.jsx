/**
 * Renders the entire grid as Cell components based on the given grid array.
 */

import Cell from './Cell';

/**
 * Renders a single row of the grid as an array of Cell components.
 * onCellClick is passed straight through unchanged - the same stable
 * reference reaches every cell, which is what lets Cell's React.memo
 * skip re-rendering unaffected cells.
 * @param {number[]} row
 * @param {number} rowIndex
 * @param {(row: number, col: number) => void} onCellClick
 */
function renderRow(row, rowIndex, onCellClick) {
  return row.map(function renderCellInRow(cellValue, colIndex) {
    return (
      <Cell
        key={`${rowIndex}-${colIndex}`}
        isAlive={cellValue === 1}
        row={rowIndex}
        col={colIndex}
        onCellClick={onCellClick}
      />
    );
  });
}

/**
 * @param {{
 *   grid: number[][],
 *   tileSize: number,
 *   onCellClick: (row: number, col: number) => void
 * }} props
 */
function Grid({ grid, tileSize, onCellClick }) {
  function renderAllRows(gridData) {
    return gridData.map(function renderGridRow(row, rowIndex) {
      return renderRow(row, rowIndex, onCellClick);
    });
  }

  return (
    <div className="grid" style={{ '--grid-size': tileSize }}>
      {renderAllRows(grid)}
    </div>
  );
}

export default Grid;