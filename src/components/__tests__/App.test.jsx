/**
 * Integration test for the full App component.
 * Exercises the complete flow: click cells to form a pattern,
 * start the simulation, advance time, and verify the grid updates.
 *
 * Uses fireEvent instead of userEvent here: userEvent's internal
 * artificial delays (real setTimeout calls) conflict with fake timers
 * and cause the test to hang/time out. fireEvent fires events
 * synchronously with no internal waiting, which works cleanly
 * alongside vi.useFakeTimers().
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';
import { getConstant, resetConstantsForTesting } from '../../store/constantsStore';

describe('App', function AppIntegrationTests() {
  beforeEach(function setupFakeTimers() {
    vi.useFakeTimers();
    resetConstantsForTesting();
  });

  afterEach(function restoreRealTimers() {
    vi.useRealTimers();
  });

  it('runs a full blinker cycle from click to automatic simulation', function testFullBlinkerFlow() {
    render(<App />);

    const cells = document.querySelectorAll('.cell');
    const gridSize = getConstant('DEFAULT_TILE_SIZE');

    fireEvent.click(cells[7 * gridSize + 6]);
    fireEvent.click(cells[7 * gridSize + 7]);
    fireEvent.click(cells[7 * gridSize + 8]);

    expect(screen.getByText('Start')).not.toBeDisabled();

    fireEvent.click(screen.getByText('Start'));

    act(function advanceOneInterval() {
      vi.advanceTimersByTime(getConstant('DEFAULT_SIMULATION_SPEED_MS'));
    });

    const updatedCells = document.querySelectorAll('.cell');
    expect(updatedCells[6 * gridSize + 7]).toHaveClass('alive');
    expect(updatedCells[7 * gridSize + 7]).toHaveClass('alive');
    expect(updatedCells[8 * gridSize + 7]).toHaveClass('alive');
  });

  it('shows the admin panel only after the toggle button is clicked', function testAdminPanelToggle() {
    render(<App />);

    expect(screen.queryByPlaceholderText('Benutzername')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Admin-Bereich öffnen'));

    expect(screen.getByPlaceholderText('Benutzername')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Admin-Bereich schließen'));

    expect(screen.queryByPlaceholderText('Benutzername')).not.toBeInTheDocument();
  });
});