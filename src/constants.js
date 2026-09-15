/**
 * Central constants for the Conway's Game of Life project.
 * Contains only values that are true fixed invariants of the game -
 * never meant to change at runtime.
 *
 * Admin-configurable runtime settings (grid size, simulation speed,
 * history length, UI text) live exclusively in
 * src/store/constantsStore.js - they are intentionally NOT duplicated
 * here, so each value has exactly one place where it is defined.
 */

/** Value representing a living cell in the grid array. */
export const ALIVE_CELL_VALUE = 1;

/** Value representing a dead cell in the grid array. */
export const DEAD_CELL_VALUE = 0;

/** Minimum number of living neighbors for a living cell to survive. */
export const MIN_NEIGHBORS_TO_SURVIVE = 2;

/** Maximum number of living neighbors for a living cell to survive. */
export const MAX_NEIGHBORS_TO_SURVIVE = 3;

/** Exact number of living neighbors for a dead cell to become alive. */
export const NEIGHBORS_TO_REPRODUCE = 3;

/**
 * Relative positions of the 8 surrounding cells (Moore neighborhood),
 * as [rowOffset, colOffset] pairs.
 */
export const NEIGHBOR_OFFSETS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

/** Probability (0-1) that a cell starts alive when randomizing the grid. */
export const RANDOM_ALIVE_PROBABILITY = 0.3;