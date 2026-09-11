/**
 * Renders the entire grid as Cell components based on the given grid array.
 */

import Cell from './Cell';

/**
 * Creates a click handler bound to a specific cell position.
 * @param {(row: number, col: number) => void} onCellClick
 * @param {number} row
 * @param {number} col
 * @returns {() => void}
 */
function createCellClickHandler(onCellClick, row, col) {
  return function handleCellClick() {
    onCellClick(row, col);
  };
}

/**
 * Renders a single row of the grid as an array of Cell components.
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
        onClick={createCellClickHandler(onCellClick, rowIndex, colIndex)}
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