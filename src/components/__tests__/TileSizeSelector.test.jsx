/**
 * Unit tests for the TileSizeSelector component.
 * Verifies that all size options from the store render correctly,
 * and that selecting a new value calls onTileSizeChange with a
 * number (not the string that a native <select> element produces).
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TileSizeSelector from '../TileSizeSelector';
import { getConstant } from '../../store/constantsStore';

describe('TileSizeSelector', function TileSizeSelectorTests() {
  it("renders one option for each entry in the store's TILE_SIZE_OPTIONS", function testOptionsRendered() {
    render(<TileSizeSelector tileSize={15} onTileSizeChange={function noop() {}} />);

    getConstant('TILE_SIZE_OPTIONS').forEach(function checkOptionExists(size) {
      expect(screen.getByText(`${size} x ${size}`)).toBeInTheDocument();
    });
  });

  it('calls onTileSizeChange with a number when a new size is selected', async function testChangeHandlerReceivesNumber() {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<TileSizeSelector tileSize={15} onTileSizeChange={handleChange} />);
    await user.selectOptions(screen.getByLabelText('Rastergröße'), '20');

    // Native <select> values are always strings - this confirms the
    // component's Number(event.target.value) conversion actually runs.
    expect(handleChange).toHaveBeenCalledWith(20);
    expect(handleChange).not.toHaveBeenCalledWith('20');
  });
});