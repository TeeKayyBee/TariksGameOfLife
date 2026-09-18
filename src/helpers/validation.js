/**
 * Shared, pure validation predicates. Single source of truth for
 * "what counts as valid" for these primitive shapes - both
 * constantsStore.js (structural safety net) and AdminSettings.jsx
 * (user-facing form validation) import from here, instead of each
 * maintaining its own separate implementation of the same rule.
 */

import { MAX_TILE_SIZE } from '../constants';

/** @param {*} value @returns {boolean} */
export function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

/**
 * A valid tile size: a positive integer that does not exceed the
 * system-wide MAX_TILE_SIZE.
 * @param {*} value
 * @returns {boolean}
 */
export function isValidTileSize(value) {
  return isPositiveInteger(value) && value <= MAX_TILE_SIZE;
}

/** @param {*} value @returns {boolean} */
export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}