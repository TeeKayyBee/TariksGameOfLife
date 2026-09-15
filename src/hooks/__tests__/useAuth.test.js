import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAuth from '../useAuth';

describe('useAuth', function useAuthTests() {
  it('starts as guest', function testInitialRole() {
    const { result } = renderHook(useAuth);
    expect(result.current.role).toBe('guest');
  });

  it('grants admin role with correct credentials', function testValidLogin() {
    const { result } = renderHook(useAuth);
    act(function attemptLogin() {
      result.current.login('admin', 'admin123');
    });
    expect(result.current.role).toBe('admin');
  });

  it('stays guest with incorrect credentials', function testInvalidLogin() {
    const { result } = renderHook(useAuth);
    act(function attemptLogin() {
      result.current.login('admin', 'wrong-password');
    });
    expect(result.current.role).toBe('guest');
  });

  it('returns to guest after logout', function testLogout() {
    const { result } = renderHook(useAuth);
    act(function loginThenLogout() {
      result.current.login('admin', 'admin123');
      result.current.logout();
    });
    expect(result.current.role).toBe('guest');
  });
});