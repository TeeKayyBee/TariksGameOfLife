/**
 * Unit tests for the pure game logic functions.
 * Each test follows the Arrange-Act-Assert pattern:
 * set up input data, call the function, check the result.
 */

import { describe, it, expect } from 'vitest';
import {
  createEmptyGrid,
  createRandomGrid,
  computeNextGeneration,
  hasAliveCells,
} from '../gameLogic';

describe('createEmptyGrid', function createEmptyGridTests() {
  it('creates a grid of the given size', function testGridDimensions() {
    const grid = createEmptyGrid(5);

    expect(grid).toHaveLength(5);
    expect(grid[0]).toHaveLength(5);
  });

  it('fills every cell with 0 (dead)', function testAllCellsDead() {
    const grid = createEmptyGrid(3);

    const allDead = grid.every(function rowIsAllDead(row) {
      return row.every(function cellIsDead(cell) {
        return cell === 0;
      });
    });

    expect(allDead).toBe(true);
  });

  it('creates independent rows, not shared references', function testRowsAreIndependent() {
    const grid = createEmptyGrid(3);

    grid[0][0] = 1;

    expect(grid[1][0]).toBe(0);
    expect(grid[2][0]).toBe(0);
  });
});

describe('createRandomGrid', function createRandomGridTests() {
  it('creates a grid of the correct size', function testRandomGridDimensions() {
    const grid = createRandomGrid(10);

    expect(grid).toHaveLength(10);
    expect(grid[0]).toHaveLength(10);
  });

  it('only contains 0s and 1s', function testOnlyValidCellValues() {
    const grid = createRandomGrid(10);

    const allValid = grid.every(function rowHasValidValues(row) {
      return row.every(function cellIsValid(cell) {
        return cell === 0 || cell === 1;
      });
    });

    expect(allValid).toBe(true);
  });
});

describe('hasAliveCells', function hasAliveCellsTests() {
  it('returns false for an empty grid', function testEmptyGridHasNoLife() {
    const grid = createEmptyGrid(5);

    expect(hasAliveCells(grid)).toBe(false);
  });

  it('returns true if at least one cell is alive', function testDetectsLife() {
    const grid = createEmptyGrid(5);
    grid[2][2] = 1;

    expect(hasAliveCells(grid)).toBe(true);
  });
});

describe('computeNextGeneration', function computeNextGenerationTests() {
  it('kills a live cell with no neighbors (underpopulation)', function testUnderpopulation() {
    const grid = createEmptyGrid(5);
    grid[2][2] = 1; 

    const next = computeNextGeneration(grid, 5);

    expect(next[2][2]).toBe(0);
  });

  it('brings a dead cell to life with exactly 3 neighbors (reproduction)', function testReproduction() {
    const grid = createEmptyGrid(5);
  
    grid[1][1] = 1;
    grid[1][2] = 1;
    grid[2][1] = 1;

    const next = computeNextGeneration(grid, 5);

    expect(next[2][2]).toBe(1);
  });

  it('keeps a live cell alive with 2 neighbors (survival)', function testSurvivalWithTwoNeighbors() {
    const grid = createEmptyGrid(5);
    grid[2][2] = 1;
    grid[1][2] = 1;
    grid[3][2] = 1;

    const next = computeNextGeneration(grid, 5);

    expect(next[2][2]).toBe(1);
  });

  it('kills a live cell with 4+ neighbors (overpopulation)', function testOverpopulation() {
    const grid = createEmptyGrid(5);
    grid[2][2] = 1;
    grid[1][1] = 1;
    grid[1][2] = 1;
    grid[1][3] = 1;
    grid[3][1] = 1;

    const next = computeNextGeneration(grid, 5);

    expect(next[2][2]).toBe(0);
  });

  it('correctly oscillates the classic blinker pattern', function testBlinkerOscillation() {
    const grid = createEmptyGrid(5);

    grid[2][1] = 1;
    grid[2][2] = 1;
    grid[2][3] = 1;

    const afterOneStep = computeNextGeneration(grid, 5);

    expect(afterOneStep[1][2]).toBe(1);
    expect(afterOneStep[2][2]).toBe(1);
    expect(afterOneStep[3][2]).toBe(1);
    expect(afterOneStep[2][1]).toBe(0);
    expect(afterOneStep[2][3]).toBe(0);

    const afterTwoSteps = computeNextGeneration(afterOneStep, 5);

    expect(afterTwoSteps).toEqual(grid);
  });

  it('does not count out-of-bounds neighbors for edge cells', function testEdgeCellsDoNotWrapAround() {
    const grid = createEmptyGrid(3);

    grid[0][0] = 1;
    grid[0][1] = 1;

    const next = computeNextGeneration(grid, 3);

    expect(next[0][0]).toBe(0);
    expect(next[0][1]).toBe(0);
  });
});