/**
 * A minimal, encapsulated store for admin-configurable settings.
 * These values (grid size, simulation speed bounds, history length,
 * UI text) are defined ONLY here - nowhere else in the codebase - so
 * there is exactly one place to look for their current value.
 * Everything that needs them (hooks, components, tests) must import
 * from this store.
 *
 * The actual data lives in a module-private variable that is never
 * exported directly - the only way to read or write it is through
 * getConstant() / getAllConstants() / setConstant() below.
 */

/** The only role permitted to write to the store. */
const ADMIN_ROLE = 'admin';

/** The store's initial values - the single source of truth for these settings. */
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

// Module-private state. Deliberately not exported - this is the
// entire point of the encapsulation.
let data = { ...INITIAL_DATA };

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
 * Returns a shallow copy of all config values. A copy, not the live
 * object itself, so callers cannot bypass setConstant() by mutating
 * the returned object directly.
 * @returns {object}
 */
export function getAllConstants() {
  return { ...data };
}

/**
 * Updates a single config value. Only permitted for the admin role.
 * For UI_TEXT, value must be the complete text object - this replaces
 * it wholesale rather than merging individual keys, keeping the write
 * behavior consistent with every other stored value.
 * @param {string} key - must be an existing key in the store.
 * @param {*} value
 * @param {string} role - the role of the user attempting the write.
 * @returns {boolean} true if the write succeeded, false if denied or invalid.
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
  return true;
}

/**
 * Resets the store back to its initial values.
 * Primarily useful for tests, so each test starts from a known state
 * instead of leaking changes from a previous test.
 */
export function resetConstantsForTesting() {
  data = { ...INITIAL_DATA };
}