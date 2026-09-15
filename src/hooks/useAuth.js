/**
 * Minimal simulated authentication for this exercise.
 * NOTE: This is a client-side demo only - the "password" is visible
 * in the shipped JavaScript bundle, so this provides zero real
 * security. A real application would send credentials to a server
 * and receive a role back. This exists purely to practice the RBAC
 * pattern used by constantsStore.js.
 */

import { useState, useCallback } from 'react';

const DEMO_ADMIN_USERNAME = 'admin';
const DEMO_ADMIN_PASSWORD = 'admin123';

/**
 * @returns {{
 *   role: 'guest' | 'admin',
 *   login: (username: string, password: string) => boolean,
 *   logout: () => void
 * }}
 */
function useAuth() {
  const [role, setRole] = useState('guest');

  const login = useCallback(function login(username, password) {
    const isValid = username === DEMO_ADMIN_USERNAME && password === DEMO_ADMIN_PASSWORD;
    setRole(isValid ? 'admin' : 'guest');
    return isValid;
  }, []);

  const logout = useCallback(function logout() {
    setRole('guest');
  }, []);

  return { role, login, logout };
}

export default useAuth;