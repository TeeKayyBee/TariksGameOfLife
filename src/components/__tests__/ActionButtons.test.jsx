/**
 * Unit tests for the ActionButtons component.
 * Focuses on the disabled states of each button, since that logic
 * (isRunning / canStepForward / canStepBackward combinations) is the
 * most error-prone part of this component.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionButtons from '../ActionButtons';

function renderActionButtons(overrides) {
  const defaultProps = {
    isRunning: false,
    canStepBackward: true,
    canStepForward: true,
    onStepBackward: vi.fn(),
    onStepForward: vi.fn(),
    onStart: vi.fn(),
    onStop: vi.fn(),
    onRandomize: vi.fn(),
    onReset: vi.fn(),
  };

  const props = { ...defaultProps, ...overrides };
  render(<ActionButtons {...props} />);
  return props;
}

describe('ActionButtons', function ActionButtonsTests() {
  it('disables "Start" and "Schritt vor" when the grid has no living cells', function testDisabledWhenNoLife() {
    renderActionButtons({ canStepForward: false });

    expect(screen.getByText('Start')).toBeDisabled();
    expect(screen.getByText('Schritt vor')).toBeDisabled();
  });

  it('disables "Schritt zurück" when there is no history', function testDisabledWithoutHistory() {
    renderActionButtons({ canStepBackward: false });

    expect(screen.getByText('Schritt zurück')).toBeDisabled();
  });

  it('disables step and start buttons while the simulation is running', function testDisabledWhileRunning() {
    renderActionButtons({ isRunning: true });

    expect(screen.getByText('Schritt vor')).toBeDisabled();
    expect(screen.getByText('Schritt zurück')).toBeDisabled();
    expect(screen.getByText('Start')).toBeDisabled();
    expect(screen.getByText('Stop')).not.toBeDisabled();
  });

  it('calls onRandomize when the "Zufall" button is clicked', async function testRandomizeClick() {
    const user = userEvent.setup();
    const props = renderActionButtons();

    await user.click(screen.getByText('Zufall'));

    expect(props.onRandomize).toHaveBeenCalledTimes(1);
  });
});