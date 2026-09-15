/**
 * Unit tests for the Grid component.
 * Verifies that the correct number of cells is rendered with the
 * correct alive/dead state, and that clicking a cell reports the
 * correct row/col back to the parent.
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Grid from '../Grid';

describe('Grid', function GridTests() {
  it('renders one .cell element per grid entry', function testCellCount() {
    const grid = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];
    render(<Grid grid={grid} tileSize={3} onCellClick={function noop() {}} />);
    expect(document.querySelectorAll('.cell')).toHaveLength(9);
  });

  it('marks only the living cell as alive', function testAliveCellRendering() {
    const grid = [
      [0, 0],
      [1, 0],
    ];
    render(<Grid grid={grid} tileSize={2} onCellClick={function noop() {}} />);
    const cells = document.querySelectorAll('.cell');
    expect(cells[2]).toHaveClass('alive');
    expect(cells[0]).toHaveClass('dead');
    expect(cells[1]).toHaveClass('dead');
    expect(cells[3]).toHaveClass('dead');
  });

  it('reports the correct row and column when a cell is clicked', async function testClickReportsPosition() {
    const grid = [
      [0, 0],
      [0, 0],
    ];
    const handleCellClick = vi.fn();
    const user = userEvent.setup();

    render(<Grid grid={grid} tileSize={2} onCellClick={handleCellClick} />);
    const cells = document.querySelectorAll('.cell');
    await user.click(cells[3]);

    expect(handleCellClick).toHaveBeenCalledWith(1, 1);
  });
});