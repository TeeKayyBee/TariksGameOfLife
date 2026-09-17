/**
 * Unit tests for the TileSizeSelector component.
 * Verifies that all size options render and that selecting a new
 * value calls onTileSizeChange with a number (not a string).
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TileSizeSelector from '../TileSizeSelector';
import { TILE_SIZE_OPTIONS } from '../../constants';

describe('TileSizeSelector', function TileSizeSelectorTests() {
  it('renders one option for each entry in TILE_SIZE_OPTIONS', function testOptionsRendered() {
    render(<TileSizeSelector tileSize={15} onTileSizeChange={function noop() {}} />);

    TILE_SIZE_OPTIONS.forEach(function checkOptionExists(size) {
      expect(screen.getByText(`${size} x ${size}`)).toBeInTheDocument();
    });
  });

  it('calls onTileSizeChange with a number when a new size is selected', async function testChangeHandlerReceivesNumber() {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<TileSizeSelector tileSize={15} onTileSizeChange={handleChange} />);
    await user.selectOptions(screen.getByLabelText('Rastergröße'), '20');

    expect(handleChange).toHaveBeenCalledWith(20);
    expect(handleChange).not.toHaveBeenCalledWith('20');
  });
});