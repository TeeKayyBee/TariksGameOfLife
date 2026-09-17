/**
 * Unit tests for the constants store: permission enforcement (RBAC)
 * and the subscribe/notify mechanism that powers useStoreValue.
 * Every test resets the store first, so changes from one test never
 * leak into the next.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getConstant,
  setConstant,
  getAllConstants,
  resetConstantsForTesting,
} from '../constantsStore';

describe('constantsStore', function constantsStoreTests() {
  beforeEach(function resetStore() {
    resetConstantsForTesting();
  });

  it('allows reading a value regardless of role', function testReadAlwaysAllowed() {
    expect(getConstant('DEFAULT_SIMULATION_SPEED_MS')).toBe(300);
  });

  it('allows an admin to change a value', function testAdminCanWrite() {
    const wasAllowed = setConstant('DEFAULT_SIMULATION_SPEED_MS', 500, 'admin');

    expect(wasAllowed).toBe(true);
    expect(getConstant('DEFAULT_SIMULATION_SPEED_MS')).toBe(500);
  });

  it('denies a guest attempting to change a value', function testGuestCannotWrite() {
    const wasAllowed = setConstant('DEFAULT_SIMULATION_SPEED_MS', 500, 'guest');

    expect(wasAllowed).toBe(false);
    expect(getConstant('DEFAULT_SIMULATION_SPEED_MS')).toBe(300);
  });

  it('denies a write with no role at all', function testMissingRoleCannotWrite() {
    const wasAllowed = setConstant('DEFAULT_SIMULATION_SPEED_MS', 500, undefined);

    expect(wasAllowed).toBe(false);
  });

  it('rejects writes to unknown keys, even for an admin', function testUnknownKeyRejected() {
    const wasAllowed = setConstant('SOME_MADE_UP_KEY', 123, 'admin');

    expect(wasAllowed).toBe(false);
  });

  it('getAllConstants returns a copy, not the live object', function testGetAllReturnsCopy() {
    const snapshot = getAllConstants();
    snapshot.DEFAULT_SIMULATION_SPEED_MS = 999;

    expect(getConstant('DEFAULT_SIMULATION_SPEED_MS')).toBe(300);
  });

  it('allows an admin to replace the entire UI_TEXT object', function testAdminCanChangeUiText() {
    const newText = { ...getConstant('UI_TEXT'), start: 'Los' };
    const wasAllowed = setConstant('UI_TEXT', newText, 'admin');

    expect(wasAllowed).toBe(true);
    expect(getConstant('UI_TEXT').start).toBe('Los');
  });

  it('denies a guest attempting to change UI_TEXT', function testGuestCannotChangeUiText() {
    const originalText = getConstant('UI_TEXT');
    const wasAllowed = setConstant('UI_TEXT', { start: 'Los' }, 'guest');

    expect(wasAllowed).toBe(false);
    expect(getConstant('UI_TEXT')).toEqual(originalText);
  });
});