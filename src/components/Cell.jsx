/**
 * Represents a single cell within the Game of Life grid.
 * 
 * @param props - Component properties.
 * @param props.isAlive - Determines whether the cell is alive (true) or dead (false).
 * @param props.onClick - Callback function triggered when clicking on the cell.
 * @returns An interactive div element representing the visual state of the cell.
 */

function Cell({ isAlive, onClick }) {
  return (
    <div
      className={`cell ${isAlive ? 'alive' : 'dead'}`}
      onClick={onClick}
    />
  );
}

export default Cell;