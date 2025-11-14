/**
 * @summary
 * Throttle service for manual refresh operations.
 * Prevents excessive API calls by enforcing minimum intervals.
 *
 * @module services/weather/throttleService
 */

interface ThrottleEntry {
  lastRefresh: number;
}

interface ThrottleStore {
  [location: string]: ThrottleEntry;
}

const throttleStore: ThrottleStore = {};
const THROTTLE_INTERVAL_MS = 30000; // 30 seconds

/**
 * @summary
 * Checks if a location can be refreshed based on throttle rules.
 *
 * @function canRefresh
 *
 * @param {string} location - Location name
 *
 * @returns {boolean} True if refresh is allowed
 */
export function canRefresh(location: string): boolean {
  const key = location.toLowerCase();
  const entry = throttleStore[key];

  if (!entry) {
    return true;
  }

  const now = Date.now();
  const timeSinceLastRefresh = now - entry.lastRefresh;

  return timeSinceLastRefresh >= THROTTLE_INTERVAL_MS;
}

/**
 * @summary
 * Records a refresh timestamp for a location.
 *
 * @function recordRefresh
 *
 * @param {string} location - Location name
 */
export function recordRefresh(location: string): void {
  const key = location.toLowerCase();
  throttleStore[key] = {
    lastRefresh: Date.now(),
  };
}

/**
 * @summary
 * Clears all throttle records.
 *
 * @function clear
 */
export function clear(): void {
  Object.keys(throttleStore).forEach((key) => delete throttleStore[key]);
}

/**
 * @summary
 * Periodic cleanup of old throttle entries.
 * Runs every 5 minutes.
 */
setInterval(() => {
  const now = Date.now();
  const maxAge = THROTTLE_INTERVAL_MS * 2; // Keep entries for 1 minute

  Object.keys(throttleStore).forEach((key) => {
    const entry = throttleStore[key];
    if (now - entry.lastRefresh > maxAge) {
      delete throttleStore[key];
    }
  });
}, 300000); // 5 minutes

export const throttleService = {
  canRefresh,
  recordRefresh,
  clear,
};
