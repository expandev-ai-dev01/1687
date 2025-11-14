/**
 * @summary
 * In-memory cache service for weather data.
 * Implements TTL-based caching to reduce external API calls.
 *
 * @module services/weather/cacheService
 */

import { config } from '@/config';
import { TemperatureData, TemperatureUnit } from '@/services/weather/weatherTypes';

interface CacheEntry {
  data: TemperatureData;
  timestamp: number;
}

interface CacheStore {
  [key: string]: CacheEntry;
}

const cache: CacheStore = {};

/**
 * @summary
 * Generates cache key from location and unit.
 *
 * @function getCacheKey
 *
 * @param {string} location - Location name
 * @param {TemperatureUnit} unit - Temperature unit
 *
 * @returns {string} Cache key
 */
function getCacheKey(location: string, unit: TemperatureUnit): string {
  return `${location.toLowerCase()}_${unit}`;
}

/**
 * @summary
 * Retrieves cached temperature data if valid.
 *
 * @function get
 *
 * @param {string} location - Location name
 * @param {TemperatureUnit} unit - Temperature unit
 *
 * @returns {TemperatureData | null} Cached data or null if expired/missing
 */
export function get(location: string, unit: TemperatureUnit): TemperatureData | null {
  const key = getCacheKey(location, unit);
  const entry = cache[key];

  if (!entry) {
    return null;
  }

  /**
   * @rule {fn-order-processing} Check if cache entry is still valid (within TTL)
   */
  const now = Date.now();
  const age = now - entry.timestamp;
  const ttlMs = config.cache.ttl * 1000;

  if (age > ttlMs) {
    delete cache[key];
    return null;
  }

  /**
   * @rule {fn-order-processing} Mark data as potentially outdated after 1 hour
   */
  const oneHourMs = 3600000;
  if (age > oneHourMs) {
    return {
      ...entry.data,
      status: 'outdated',
    };
  }

  return entry.data;
}

/**
 * @summary
 * Stores temperature data in cache.
 *
 * @function set
 *
 * @param {string} location - Location name
 * @param {TemperatureUnit} unit - Temperature unit
 * @param {TemperatureData} data - Temperature data to cache
 */
export function set(location: string, unit: TemperatureUnit, data: TemperatureData): void {
  const key = getCacheKey(location, unit);
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
}

/**
 * @summary
 * Clears all cached data.
 *
 * @function clear
 */
export function clear(): void {
  Object.keys(cache).forEach((key) => delete cache[key]);
}

/**
 * @summary
 * Periodic cleanup of expired cache entries.
 * Runs every cache.checkPeriod seconds.
 */
setInterval(() => {
  const now = Date.now();
  const ttlMs = config.cache.ttl * 1000;

  Object.keys(cache).forEach((key) => {
    const entry = cache[key];
    if (now - entry.timestamp > ttlMs) {
      delete cache[key];
    }
  });
}, config.cache.checkPeriod * 1000);

export const cacheService = {
  get,
  set,
  clear,
};
