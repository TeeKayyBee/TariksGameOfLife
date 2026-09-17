/**
 * A minimal, encapsulated store for admin-configurable settings.
 * These values (grid size, simulation speed bounds, history length,
 * UI text) are defined ONLY here - nowhere else in the codebase.
 *
 * The actual data lives in a module-private variable that is never
 * exported directly - the only way to read or write it is through
 * getConstant() / getAllConstants() / setConstant() below. Includes
 * a subscribe/notify mechanism so React components can react to
 * changes via useSyncExternalStore.
 */

const ADMIN_ROLE = 'admin';

const INITIAL_DATA = {
  DEFAULT_TILE_SIZE: 15,
  TILE_SIZE_OPTIONS: [10, 15, 20, 25],
  DEFAULT_SIMULATION_SPEED_MS: 300,
  MIN_SIMULATION_SPEED_MS: 50,
  MAX_SIMULATION_SPEED_MS: 1000,
  SIMULATION_SPEED_STEP_MS: 50,
  MAX_HISTORY_LENGTH: 50,
  UI_TEXT: {
    stepBackward: 'Schritt zurück',
    stepForward: 'Schritt vor',
    start: 'Start',
    stop: 'Stop',
    randomize: 'Zufall',
    reset: 'Reset',
    tileSizeLabel: 'Rastergröße',
    speedLabel: 'Geschwindigkeit',
    appTitle: "Tarik's Game of Life",
  },
};

/**
 * Creates a fresh, fully independent copy of the initial data.
 * structuredClone performs a deep copy, so nested values like
 * TILE_SIZE_OPTIONS (array) and UI_TEXT (object) get their own new
 * references too - not just the outer object. Without this, `data`
 * and `INITIAL_DATA` would share the same nested array/object
 * instances, meaning a future direct mutation of a nested value
 * (even accidental) would corrupt INITIAL_DATA itself, breaking
 * resetConstantsForTesting()'s guarantee of returning to a true
 * original state.
 * @returns {object}
 */
function cloneInitialData() {
  return structuredClone(INITIAL_DATA);
}

// Module-private state. Deliberately not exported - this is the
// entire point of the encapsulation.
let data = cloneInitialData();

const listeners = new Set();

function notifyListeners() {
  listeners.forEach(function callListener(listener) {
    listener();
  });
}

/**
 * Registers a callback to be invoked after every successful write.
 * Returns an unsubscribe function, matching the shape
 * useSyncExternalStore expects.
 * @param {() => void} listener
 * @returns {() => void} unsubscribe
 */
export function subscribeToConstants(listener) {
  listeners.add(listener);
  return function unsubscribe() {
    listeners.delete(listener);
  };
}

/**
 * Reads a single config value. Reading is always allowed for every
 * role - only writing is restricted.
 * @param {string} key
 * @returns {*}
 */
export function getConstant(key) {
  return data[key];
}

/**
 * Returns a shallow copy of all config values.
 * @returns {object}
 */
export function getAllConstants() {
  return { ...data };
}

/**
 * Updates a single config value. Only permitted for the admin role.
 * Notifies all subscribers on success, so every component reading
 * this value via useSyncExternalStore re-renders immediately.
 * @param {string} key
 * @param {*} value
 * @param {string} role
 * @returns {boolean}
 */
export function setConstant(key, value, role) {
  if (role !== ADMIN_ROLE) {
    console.warn(`Permission denied: role "${role}" cannot modify "${key}".`);
    return false;
  }
  if (!(key in data)) {
    console.warn(`Unknown constant "${key}" - ignoring write.`);
    return false;
  }

  data = { ...data, [key]: value };
  notifyListeners();
  return true;
}

/**
 * Resets the store back to a fresh deep copy of its initial values.
 * Primarily useful for tests, so each test starts from a known,
 * uncorrupted state.
 */
export function resetConstantsForTesting() {
  data = cloneInitialData();
  notifyListeners();
}