/**
 * Unit test for the Controls component.
 * Since ActionButtons, TileSizeSelector and SpeedSelector already have
 * their own dedicated tests, this only verifies that Controls correctly
 * composes and renders all three - not their individual behavior again.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Controls from '../Controls';

/**
 * Renders Controls with a full, valid set of default props, since
 * every prop is required - this avoids repeating the same 13-prop
 * object literal in every test below.
 */
function renderControls() {
  render(
    <Controls
      isRunning={false}
      tileSize={15}
      speedMs={300}
      canStepBackward={false}
      canStepForward={true}
      onStepBackward={vi.fn()}
      onStepForward={vi.fn()}
      onStart={vi.fn()}
      onStop={vi.fn()}
      onRandomize={vi.fn()}
      onReset={vi.fn()}
      onTileSizeChange={vi.fn()}
      onSpeedChange={vi.fn()}
    />
  );
}

describe('Controls', function ControlsTests() {
  it('renders the action buttons', function testActionButtonsPresent() {
    renderControls();
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('renders the tile size and speed selectors', function testSelectorsPresent() {
    renderControls();
    expect(screen.getByLabelText('Rastergröße')).toBeInTheDocument();
    expect(screen.getByLabelText('Geschwindigkeit')).toBeInTheDocument();
  });
});