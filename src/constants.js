/**
 * Central constants for the Conway's Game of Life project.
 * Single source of truth for all fixed values, so no
 * "magic numbers" are scattered throughout the rest of the code.
 */

/** Default grid size when the app first loads. */
export const DEFAULT_TILE_SIZE = 15;

/** Selectable grid sizes shown in the dropdown. */
export const TILE_SIZE_OPTIONS = [10, 15, 20, 25];

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

/** Default interval in milliseconds between two automatic generation steps. */
export const DEFAULT_SIMULATION_SPEED_MS = 300;

/** Fastest selectable simulation speed (lowest interval, in ms). */
export const MIN_SIMULATION_SPEED_MS = 50;

/** Slowest selectable simulation speed (highest interval, in ms). */
export const MAX_SIMULATION_SPEED_MS = 1000;

/** Step size for the speed slider, in ms. */
export const SIMULATION_SPEED_STEP_MS = 50;