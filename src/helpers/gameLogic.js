/**
 * Pure game logic for Conway's Game of Life.
 * Contains only pure functions with no side effects or React
 * dependency, so they remain independently testable.
 */

import {
  ALIVE_CELL_VALUE,
  DEAD_CELL_VALUE,
  MIN_NEIGHBORS_TO_SURVIVE,
  MAX_NEIGHBORS_TO_SURVIVE,
  NEIGHBORS_TO_REPRODUCE,
  NEIGHBOR_OFFSETS,
  RANDOM_ALIVE_PROBABILITY,
} from '../constants';

/**
 * Creates an empty square grid in which all cells are dead.
 *
 * @param {number} size - Edge length of the grid (e.g. 15 for 15x15).
 * @returns {number[][]} New 2D array filled with DEAD_CELL_VALUE.
 */
export function createEmptyGrid(size) {
  const grid = [];
  for (let row = 0; row < size; row++) {
    grid.push(new Array(size).fill(DEAD_CELL_VALUE));
  }
  return grid;
}

/**
 * Creates a grid in which each cell is randomly alive with a fixed
 * probability (RANDOM_ALIVE_PROBABILITY).
 *
 * @param {number} size - Edge length of the grid.
 * @returns {number[][]} New 2D array with randomly distributed living cells.
 */
export function createRandomGrid(size) {
  const grid = createEmptyGrid(size);
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      grid[row][col] =
        Math.random() < RANDOM_ALIVE_PROBABILITY
          ? ALIVE_CELL_VALUE
          : DEAD_CELL_VALUE;
    }
  }
  return grid;
}

/**
 * Counts how many of the 8 surrounding cells of a given position are alive.
 * Cells outside the grid are not counted (hard edge behavior).
 *
 * @param {number[][]} grid - Current grid.
 * @param {number} row - Row index of the cell being checked.
 * @param {number} col - Column index of the cell being checked.
 * @param {number} size - Edge length of the grid.
 * @returns {number} Number of living neighbors (0 to 8).
 */
function countAliveNeighbors(grid, row, col, size) {
  let count = 0;
  for (const [rowOffset, colOffset] of NEIGHBOR_OFFSETS) {
    const neighborRow = row + rowOffset;
    const neighborCol = col + colOffset;
    const isInBounds =
      neighborRow >= 0 && neighborRow < size &&
      neighborCol >= 0 && neighborCol < size;

    if (isInBounds && grid[neighborRow][neighborCol] === ALIVE_CELL_VALUE) {
      count++;
    }
  }
  return count;
}

/**
 * Computes the next generation from the current grid, following the
 * classic Conway's Game of Life rules (underpopulation, survival,
 * overpopulation, reproduction).
 *
 * @param {number[][]} grid - Current grid (not mutated).
 * @param {number} size - Edge length of the grid.
 * @returns {number[][]} New grid representing the next generation's state.
 */
export function computeNextGeneration(grid, size) {
  const newGrid = createEmptyGrid(size);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const aliveNeighbors = countAliveNeighbors(grid, row, col, size);
      const isAlive = grid[row][col] === ALIVE_CELL_VALUE;

      const survives =
        isAlive &&
        aliveNeighbors >= MIN_NEIGHBORS_TO_SURVIVE &&
        aliveNeighbors <= MAX_NEIGHBORS_TO_SURVIVE;
      const reproduces = !isAlive && aliveNeighbors === NEIGHBORS_TO_REPRODUCE;

      newGrid[row][col] =
        survives || reproduces ? ALIVE_CELL_VALUE : DEAD_CELL_VALUE;
    }
  }

  return newGrid;
}

/**
 * Checks whether at least one cell in the grid is alive.
 *
 * @param {number[][]} grid - Grid to check.
 * @returns {boolean} true if at least one living cell exists.
 */
export function hasAliveCells(grid) {
  return grid.some(function checkRowForLife(row) {
    return row.some(function checkCellIsAlive(cell) {
      return cell === ALIVE_CELL_VALUE;
    });
  });
}