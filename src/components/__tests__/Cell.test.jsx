/**
 * Unit tests for the Cell component.
 * Verifies rendering (alive/dead class) and click behavior.
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cell from '../Cell';

describe('Cell', function CellTests() {
  it('renders with the "alive" class when isAlive is true', function testAliveClass() {
    render(<Cell isAlive={true} onClick={function noop() {}} />);

    expect(document.querySelector('.cell')).toHaveClass('alive');
  });

  it('renders with the "dead" class when isAlive is false', function testDeadClass() {
    render(<Cell isAlive={false} onClick={function noop() {}} />);

    expect(document.querySelector('.cell')).toHaveClass('dead');
  });

  it('calls onClick when the cell is clicked', async function testClickHandler() {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Cell isAlive={false} onClick={handleClick} />);
    await user.click(document.querySelector('.cell'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});