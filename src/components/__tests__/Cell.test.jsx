/**
 * Unit tests for the Cell component.
 * Verifies rendering (alive/dead class), click behavior, and
 * the accessible label.
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cell from '../Cell';

describe('Cell', function CellTests() {
  it('renders with the "alive" class when isAlive is true', function testAliveClass() {
    render(<Cell isAlive={true} row={0} col={0} onCellClick={function noop() {}} />);
    expect(document.querySelector('.cell')).toHaveClass('alive');
  });

  it('renders with the "dead" class when isAlive is false', function testDeadClass() {
    render(<Cell isAlive={false} row={0} col={0} onCellClick={function noop() {}} />);
    expect(document.querySelector('.cell')).toHaveClass('dead');
  });

  it('calls onCellClick with its row and column when clicked', async function testClickHandler() {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Cell isAlive={false} row={2} col={4} onCellClick={handleClick} />);
    await user.click(document.querySelector('.cell'));

    expect(handleClick).toHaveBeenCalledWith(2, 4);
  });

  it('sets an accessible label describing position and state', function testAccessibleLabel() {
    render(<Cell isAlive={true} row={2} col={4} onCellClick={function noop() {}} />);

    expect(document.querySelector('.cell')).toHaveAttribute(
      'aria-label',
      'Row 3, column 5, alive'
    );
  });
});