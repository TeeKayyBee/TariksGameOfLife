import Cell from './Cell';
import { GRID_SIZE } from '../helpers/gameLogic';

/**
 * The game board grid rendering all cells in a matrix structure.
 * 
 * @param props - Component properties.
 * @param props.grid - Two-dimensional array containing the current state of all cells.
 * @param props.onCellClick - Callback function invoked on cell click with its respective coordinates.
 * @returns The rendered grid container with dynamically calculated CSS size properties.
 */
function Grid({ grid, onCellClick }) {
  return (
    <div
      className="grid"
      style={{ '--grid-size': GRID_SIZE }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cellValue, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            isAlive={cellValue === 1}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}

export default Grid;