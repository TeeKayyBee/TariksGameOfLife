/**
 * Subscribes a component to a single key in constantsStore, causing
 * it to re-render automatically whenever that specific value changes
 * (e.g. through an admin edit in AdminSettings).
 */

import { useSyncExternalStore } from 'react';
import { getConstant, subscribeToConstants } from '../store/constantsStore';

/**
 * @param {string} key
 * @returns {*} the current value for that key, kept in sync with the store
 */
function useStoreValue(key) {
  return useSyncExternalStore(subscribeToConstants, function getSnapshot() {
    return getConstant(key);
  });
}

export default useStoreValue;