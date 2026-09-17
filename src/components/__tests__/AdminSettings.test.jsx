/**
 * Unit tests for AdminSettings.
 * Auth state (role/onLogin/onLogout) is passed in as props by the
 * parent in the real app, which makes it trivial to test both the
 * guest and admin views directly, without needing to drive a real
 * login flow through useAuth for every test.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminSettings, { parseSizeList } from '../AdminSettings';
import { getConstant, resetConstantsForTesting } from '../../store/constantsStore';

describe('parseSizeList', function parseSizeListTests() {
  it('parses a valid comma-separated list', function testValidList() {
    expect(parseSizeList('10, 15, 20')).toEqual([10, 15, 20]);
  });

  it('drops non-numeric entries', function testDropsNonNumeric() {
    expect(parseSizeList('10, abc, 20')).toEqual([10, 20]);
  });

  it('drops zero and negative entries', function testDropsZeroAndNegative() {
    expect(parseSizeList('10, 0, -5, 20')).toEqual([10, 20]);
  });

  it('drops decimal entries', function testDropsDecimals() {
    expect(parseSizeList('10, 15.5, 20')).toEqual([10, 20]);
  });

  it('returns an empty array for an empty or invalid string', function testEmptyInput() {
    expect(parseSizeList('')).toEqual([]);
    expect(parseSizeList('abc, def')).toEqual([]);
  });
});

describe('AdminSettings', function AdminSettingsTests() {
  beforeEach(function resetStore() {
    resetConstantsForTesting();
  });

  it('shows the login form for a guest', function testGuestSeesLoginForm() {
    render(<AdminSettings role="guest" onLogin={vi.fn()} onLogout={vi.fn()} />);

    expect(screen.getByLabelText('Benutzername')).toBeInTheDocument();
    expect(screen.getByLabelText('Passwort')).toBeInTheDocument();
  });

  it('calls onLogin with the entered credentials on submit', function testLoginSubmits() {
    const handleLogin = vi.fn().mockReturnValue(true);
    render(<AdminSettings role="guest" onLogin={handleLogin} onLogout={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Benutzername'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText('Passwort'), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByText('Anmelden'));

    expect(handleLogin).toHaveBeenCalledWith('admin', 'admin123');
  });

  it('shows an error message when login fails', function testLoginFailureMessage() {
    const handleLogin = vi.fn().mockReturnValue(false);
    render(<AdminSettings role="guest" onLogin={handleLogin} onLogout={vi.fn()} />);

    fireEvent.click(screen.getByText('Anmelden'));

    expect(screen.getByText('Login fehlgeschlagen.')).toBeInTheDocument();
  });

  it('shows the settings form for an admin', function testAdminSeesSettingsForm() {
    render(<AdminSettings role="admin" onLogin={vi.fn()} onLogout={vi.fn()} />);

    expect(screen.getByLabelText('Standard-Rastergröße')).toBeInTheDocument();
    expect(screen.getByText('Alle Änderungen speichern')).toBeInTheDocument();
  });

  it('saves a valid change to the store', function testValidSaveWritesToStore() {
    render(<AdminSettings role="admin" onLogin={vi.fn()} onLogout={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Standard-Geschwindigkeit (ms)'), {
      target: { value: '400' },
    });
    fireEvent.click(screen.getByText('Alle Änderungen speichern'));

    expect(getConstant('DEFAULT_SIMULATION_SPEED_MS')).toBe(400);
    expect(screen.getByText('Gespeichert.')).toBeInTheDocument();
  });

  it('rejects an empty tile size options list and does not touch the store', function testEmptyTileOptionsRejected() {
    render(<AdminSettings role="admin" onLogin={vi.fn()} onLogout={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Rastergrößen-Optionen (kommagetrennt)'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByText('Alle Änderungen speichern'));

    expect(
      screen.getByText('Rastergrößen-Optionen: mindestens eine gültige Zahl angeben.')
    ).toBeInTheDocument();
    expect(getConstant('TILE_SIZE_OPTIONS')).toEqual([10, 15, 20, 25]);
  });

  it('rejects a minimum speed that is not smaller than the maximum', function testMinNotLessThanMaxRejected() {
    render(<AdminSettings role="admin" onLogin={vi.fn()} onLogout={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Minimale Geschwindigkeit (ms)'), {
      target: { value: '2000' },
    });
    fireEvent.click(screen.getByText('Alle Änderungen speichern'));

    expect(
      screen.getByText('Minimale Geschwindigkeit muss kleiner als die maximale sein.')
    ).toBeInTheDocument();
    expect(getConstant('MIN_SIMULATION_SPEED_MS')).toBe(50);
  });

  it('does not silently treat a cleared number field as zero', function testEmptyFieldNotSilentlyZero() {
    render(<AdminSettings role="admin" onLogin={vi.fn()} onLogout={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Maximale History-Länge'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByText('Alle Änderungen speichern'));

    expect(
      screen.getByText('Maximale History-Länge: gültige positive Zahl erforderlich.')
    ).toBeInTheDocument();
    expect(getConstant('MAX_HISTORY_LENGTH')).toBe(50);
  });

  it('rejects an empty UI text field', function testEmptyUiTextRejected() {
    render(<AdminSettings role="admin" onLogin={vi.fn()} onLogout={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Start-Knopf'), { target: { value: '' } });
    fireEvent.click(screen.getByText('Alle Änderungen speichern'));

    expect(screen.getByText('Start-Knopf: darf nicht leer sein.')).toBeInTheDocument();
    expect(getConstant('UI_TEXT').start).toBe('Start');
  });
});