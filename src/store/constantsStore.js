/**
 * A minimal, encapsulated store for admin-configurable settings.
 * Now includes a subscribe/notify mechanism so React components can
 * react to changes via useSyncExternalStore - without this, a write
 * through setConstant() would change the underlying data but nothing
 * would know to re-render.
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

let data = { ...INITIAL_DATA };

// Set of listener functions registered via subscribe(). A Set (not
// an array) makes add/remove trivial and avoids duplicate entries.
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

export function getConstant(key) {
  return data[key];
}

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

export function resetConstantsForTesting() {
  data = { ...INITIAL_DATA };
  notifyListeners();
}