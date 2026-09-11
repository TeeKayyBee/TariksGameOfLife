/**
 * The constant grid dimension of the square game board.
 * 
 * @remarks
 * This value specifies that the board consists of 15 rows and 15 columns
 * and controls loop iterations during grid generation and rule calculation.
 */
export const GRID_SIZE = 15;

/**
 * Creates a new, empty matrix (two-dimensional array) for the game board.
 * 
 * @remarks
 * All cells are initially populated with the state `0` (dead) using nested arrays.
 * The dimension is based on the predefined length `GRID_SIZE`.
 * 
 * @returns A new game board matrix where all cells have a value of `0`.
 */
export function createEmptyGrid() {
  const grid = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    grid.push(new Array(GRID_SIZE).fill(0));
  }
  return grid;
}

/**
 * Counts the living neighbors of a specific cell in the grid.
 * 
 * @param grid - The current two-dimensional array (game board).
 * @param row - The Y-coordinate (row) of the target cell.
 * @param col - The X-coordinate (column) of the target cell.
 * @returns The number of living neighbor cells (value between 0 and 8).
 */
function countAliveNeighbors(grid, row, col) {
  const neighborOffsets = [
    [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1],
  ];


  let count = 0;
  for (const [rowOffset, colOffset] of neighborOffsets) {
    const neighborRow = row + rowOffset;
    const neighborCol = col + colOffset;

    const isInBounds = neighborRow >= 0 && neighborRow < GRID_SIZE && neighborCol >= 0 && neighborCol < GRID_SIZE;

    if (isInBounds && grid[neighborRow][neighborCol] === 1) {
      count++;
    }
  }

  return count;
}

/**
 * Computes the next generation of the game board applying Conway's rules.
 * 
 * @remarks
 * The function iterates through each coordinate of the grid, determines living neighbors 
 * via `countAliveNeighbors`, and applies the following logic:
 * - A living cell remains alive with 2 or 3 neighbors.
 * - A dead cell becomes alive with exactly 3 neighbors.
 * - All other cells are marked as `0` (dead) in the new matrix.
 * 
 * @param grid - The current game board grid used as the basis for computation.
 * @returns A completely new matrix representing the subsequent state of the simulation.
 */
export function computeNextGeneration(grid) {
  const newGrid = createEmptyGrid();

  for (let row = 0; row < GRID_SIZE; row++){
    for (let col = 0; col < GRID_SIZE; col++){
      const aliveNeighbors = countAliveNeighbors(grid, row, col);
      const isAlive = grid[row][col] === 1;

      if(isAlive && (aliveNeighbors === 2 || aliveNeighbors === 3)) {
        newGrid[row][col] = 1;
      } else if (!isAlive && aliveNeighbors === 3) {
        newGrid[row][col] = 1;
      } else {
        newGrid[row][col] = 0;
      }
    }
  }

  return newGrid;
}

/**
 * Checks the given grid for the presence of living cells.
 * 
 * @remarks
 * Uses the `some` array method to efficiently scan rows and cells.
 * Short-circuits and returns `true` as soon as the first living cell (`1`) is found.
 * 
 * @param grid - The game board matrix to check.
 * @returns Returns `true` if at least one active cell exists, otherwise `false`.
 */
export function hasAliveCells(grid) {
  return grid.some(row => row.some(cell => cell === 1));
}