/**
 * Renders a single cell of the grid.
 * Purely visual/interactive - has no knowledge of its own position in the grid.
 */

/**
 * @param {{ isAlive: boolean, onClick: () => void }} props
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