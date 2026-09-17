/**
 * Unit tests for the SpeedSelector component.
 * Uses fireEvent instead of user-event for the range input, since
 * user-event does not reliably simulate dragging a native slider -
 * fireEvent.change directly sets the value, which is sufficient here
 * since we're testing the resulting handler call, not the drag gesture.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SpeedSelector from '../SpeedSelector';
import {
  MIN_SIMULATION_SPEED_MS,
  MAX_SIMULATION_SPEED_MS,
} from '../../constants';

describe('SpeedSelector', function SpeedSelectorTests() {
  it('displays the current speed value', function testDisplaysCurrentSpeed() {
    render(<SpeedSelector speedMs={300} onSpeedChange={function noop() {}} />);

    expect(screen.getByText('300ms')).toBeInTheDocument();
  });

  it('has the correct min and max bounds', function testSliderBounds() {
    render(<SpeedSelector speedMs={300} onSpeedChange={function noop() {}} />);

    const slider = screen.getByLabelText('Geschwindigkeit');
    expect(slider).toHaveAttribute('min', String(MIN_SIMULATION_SPEED_MS));
    expect(slider).toHaveAttribute('max', String(MAX_SIMULATION_SPEED_MS));
  });

  it('calls onSpeedChange with a number when the slider moves', function testChangeHandlerReceivesNumber() {
    const handleChange = vi.fn();

    render(<SpeedSelector speedMs={300} onSpeedChange={handleChange} />);
    fireEvent.change(screen.getByLabelText('Geschwindigkeit'), {
      target: { value: '500' },
    });

    expect(handleChange).toHaveBeenCalledWith(500);
  });
});